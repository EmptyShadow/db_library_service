(function () {
    'use strict';

    angular.module('Library').factory('Publication', Publication);

    /**
     * Прототип объекта автор
     */
    Publication.$inject = ['$http', '$window', 'Author', 'Edition'];
    function Publication($http, $window, Author, Edition) {
        /**
         * Конструктор объекта
         * @param {Данные автора} dataPublication 
         */
        function Publication(dataPublication) {
            if (dataPublication) {
                this.setData(dataPublication);
                return
            }

            this.id = undefined;
            this.titles = [];
            this.datepub = undefined;
            this.is_vak = undefined;
            this.is_rince = undefined;
            this.wos = '';
            this.scopus_id = '';
            this.doi = '';
            this.link = '';
            this.dataout = '';
            this.type = undefined;
            this.authors = [];
            this.editor = undefined;
        };

        /**
         * Прототип, в котором содержатся методы
         */
        Publication.prototype = {
            /**
             * Изменить данные
             */
            setData: function (dataPublication) {
                angular.extend(this, dataPublication);
            },
            /**
             * Поиск авторов по идентификатуру и именам
             */
            find: function (callback) {
                let service = this;
                $http({
                    method: 'POST',
                    url: '/publications/search',
                    data: this,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function success(response) {
                        if (callback) {
                            let publications = service.createdIsArray(response.data);
                            callback('', publications);
                        }
                    },
                    function error(response) {
                        if (callback) {
                            callback(response.data, []);
                        }
                    }
                );
            },
            createdIsArray: function (data) {
                let publications = [];
                for (let i = 0; i < data.length; i++) {
                    publications.push(new Publication(data[i]));
                }
                return publications;
            },
            copy: function () {
                return new Publication(this);
            },
            createPublication: function (callback) {
                $http({
                    method: 'POST',
                    url: '/publication/create',
                    data: this,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function success(response) {
                        if (callback) {
                            let publication = new Publication(response.data);
                            console.log(publication);
                            callback('', publication);
                        }
                    },
                    function error(response) {
                        if (callback) {
                            callback(response.data, null);
                        }
                    }
                );
            },
            updatePublication: function (callback) {
                $http({
                    method: 'POST',
                    url: '/publication/update',
                    data: this,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function success(response) {
                        if (callback) {
                            callback('');
                        }
                    },
                    function error(response) {
                        if (callback) {
                            callback(response.data);
                        }
                    }
                );
            },
            remove: function (callback) {
                $http({
                    method: 'DELETE',
                    url: '/publication/' + this.id
                }).then(
                    function success(response) {
                        if (callback) {
                            callback('');
                        }
                    },
                    function error(response) {
                        if (callback) {
                            callback(response.data);
                        }
                    }
                );
            },
            createPublicationTitle: function (title, callback) {
                $http({
                    method: 'POST',
                    url: '/publication/' + this.id + '/title/create',
                    data: title,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function success(response) {
                        if (callback) {
                            callback('', angular.fromJson(response.data));
                        }
                    },
                    function error(response) {
                        if (callback) {
                            callback(response.data, null);
                        }
                    }
                );
            },
            updatePublicationTitle: function (title, callback) {
                $http({
                    method: 'POST',
                    url: '/publication/title/update',
                    data: title,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function success(response) {
                        if (callback) {
                            callback('', angular.fromJson(response.data));
                        }
                    },
                    function error(response) {
                        if (callback) {
                            callback(response.data, null);
                        }
                    }
                );
            },
            removePublicationTitle: function (title, callback) {
                $http({
                    method: 'DELETE',
                    url: '/publication/title/' + title.id
                }).then(
                    function success(response) {
                        console.log('s');
                        if (callback) {
                            callback('');
                        }
                    },
                    function error(response) {
                        console.log('e');
                        if (callback) {
                            callback(response.data);
                        }
                    }
                );
            },
            addAuthor: function (idPublication, idAuthor, callback) {
                $http({
                    method: 'GET',
                    url: '/author/' + idAuthor
                }).then(
                    function success(response) {
                        $http({
                            method: 'GET',
                            url: '/publication/' + idPublication + '/author/' + idAuthor
                        }).then(
                            function success(response) {
                                callback('', new Author(response.data));
                            },
                            function error(response) {
                                callback(response.data, null);
                            }
                        );
                    },
                    function error(response) {
                        callback(response.data, null);
                    }
                );
            },
            removeAuthor: function (idPublication, idAuthor, callback) {
                $http({
                    method: 'DELETE',
                    url: '/publication/' + idPublication + '/author/' + idAuthor
                }).then(
                    function success(response) {
                        callback('');
                    },
                    function error(response) {
                        callback(response.data);
                    }
                );
            },
            replaceEditor: function (idPublication, idEditor, callback) {
                $http({
                    method: 'GET',
                    url: '/editor/' + idEditor
                }).then(
                    function success(response) {
                        let editor = new Edition(response.data);
                        $http({
                            method: 'GET',
                            url: '/publication/' + idPublication + '/editor/' + idEditor
                        }).then(
                            function success(response) {
                                callback('', editor);
                            },
                            function error(response) {
                                callback(response.data, null);
                            }
                        );
                    },
                    function error(response) {
                        console.log(response.data);
                        callback(response.data, null);
                    }
                );
            },
            removeEditor: function (idPublication, callback) {
                $http({
                    method: 'DELETE',
                    url: '/publication/' + idPublication + '/editor'
                }).then(
                    function success(response) {
                        callback('');
                    },
                    function error(response) {
                        callback(response.data);
                    }
                );
            }
        };
        return Publication;
    }
})();