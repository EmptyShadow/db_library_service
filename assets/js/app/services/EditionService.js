(function () {
    'use strict';

    angular.module('Library').factory('Edition', Edition);

    /**
     * Прототип объекта автор
     */
    Edition.$inject = ['$http', '$window'];
    function Edition($http, $window) {
        /**
         * Конструктор объекта
         * @param {Данные автора} dataEdition 
         */
        function Edition(dataEdition) {
            if (dataEdition) {
                this.setData(dataEdition);
                return
            }

            this.id = '';
            this.titles = [];
        };

        /**
         * Прототип, в котором содержатся методы
         */
        Edition.prototype = {
            /**
             * Изменить данные
             */
            setData: function (dataEdition) {
                angular.extend(this, dataEdition);
            },
            /**
             * Поиск авторов по идентификатуру и именам
             */
            find: function (data, callback) {
                let service = this;
                $http({
                    method: 'POST',
                    url: '/editions/search',
                    data: data,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function success(response) {
                        console.log(response.data);
                        if (callback) {
                            callback('', service.createdIsArray(response.data));
                        }
                    },
                    function error(response) {
                        if (callback) {
                            callback(response.data, []);
                        }
                    }
                );
            },
            findOne: function (name) {
                $http({
                    method: 'GET',
                    url: '/edition/search/:name',
                }).then(
                    function success(response) {
                        console.log(response.data);
                        if (callback) {
                            callback('', service.createdIsArray(response.data));
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
                let editions = [];
                for (let i = 0; i < data.length; i++) {
                    editions.push(new Edition(data[i]));
                }
                return editions;
            },
            toString: function () {
                let str = "";
                if (this.id) { str += "id: " + this.id; }
                if (this.titles && this.titles.length > 1) {
                    str += " " + this.titles[0].name;
                }
                return str;
            },
            create: function (callback) {
                $http({
                    method: 'POST',
                    url: '/editor/create',
                    data: this,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function success(response) {
                        console.log(response.data);
                        if (callback) {
                            callback('', new Edition(response.data));
                        }
                    },
                    function error(response) {
                        console.log(response.data);
                        if (callback) {
                            callback(response.data, null);
                        }
                    }
                );
            },
            addTitle: function (title, callback) {
                $http({
                    method: 'POST',
                    url: '/editor/' + this.id + '/add/title',
                    data: title,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function success(response) {
                        console.log(response.data);
                        if (callback) {
                            callback('', angular.fromJson(response.data));
                        }
                    },
                    function error(response) {
                        console.log(response.data);
                        if (callback) {
                            callback(response.data, null);
                        }
                    }
                );
            },
            updateTitle: function (title, callback) {
                $http({
                    method: 'POST',
                    url: '/editor/title/update',
                    data: title,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function success(response) {
                        console.log(response.data);
                        if (callback) {
                            callback('', angular.fromJson(response.data));
                        }
                    },
                    function error(response) {
                        console.log(response.data);
                        if (callback) {
                            callback(response.data, null);
                        }
                    }
                );
            },
            remove: function (callback) {
                $http({
                    method: 'DELETE',
                    url: '/editor/' + this.id
                }).then(
                    function success(response) {
                        console.log('success remove editor');
                        console.log(response.data);
                        callback('');
                    },
                    function error(response) {
                        console.log('error remove editor');
                        console.log(response.data);
                        callback(response.data);
                    }
                );
            },
            removeTitle: function (title, callback) {
                $http({
                    method: 'DELETE',
                    url: '/editor/' + this.id + '/title/' + title.id
                }).then(
                    function success(response) {
                        console.log('success remove title');
                        console.log(response.data);
                        callback('');
                    },
                    function error(response) {
                        console.log('error remove title');
                        console.log(response.data);
                        callback(response.data);
                    }
                );
            }
        };
        return Edition;
    }
})();