(function () {
    'use strict';

    angular.module('Library').factory('Author', Author);

    /**
     * Прототип объекта автор
     */
    Author.$inject = ['$http', '$window'];
    function Author($http, $window) {
        /**
         * Конструктор объекта
         * @param {Данные автора} dataAuthor 
         */
        function Author(dataAuthor) {
            if (dataAuthor) {
                this.setData(dataAuthor);
                return
            }

            this.id = '';
            this.names = [];
            this.publications = [];
        };

        /**
         * Прототип, в котором содержатся методы
         */
        Author.prototype = {
            /**
             * Изменить данные
             */
            setData: function (dataAuthor) {
                angular.extend(this, dataAuthor);
            },
            /**
             * Поиск авторов по идентификатуру и именам
             */
            find: function (data, callback) {
                let service = this;
                $http({
                    method: 'POST',
                    url: '/authors/search',
                    data: data,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function success(response) {
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
                let authors = [];
                for (let i = 0; i < data.length; i++) {
                    authors.push(new Author(data[i]));
                }
                return authors;
            },
            toString: function () {
                let str = "";
                if (this.id) { str += "id: " + this.id; }
                if (this.names && this.names.length > 1) {
                    str += " " + this.names[0].firstname + " "
                        + this.names[0].lastname;
                }
                return str;
            },
            remove: function () {
                $http({
                    method: 'DELETE',
                    url: '/author/' + this.id
                }).then(
                    function success(response) {
                        console.log('success remove author');
                        console.log(response.data);
                    },
                    function error(response) {
                        console.log('error remove author');
                        console.log(response.data);
                    }
                );
            },
            removeName: function (name) {
                $http({
                    method: 'DELETE',
                    url: '/author/' + this.id + '/name/' + name.id
                }).then(
                    function success(response) {
                        console.log('success remove name');
                        console.log(response.data);
                    },
                    function error(response) {
                        console.log('error remove name');
                        console.log(response.data);
                    }
                );
            },
            removePublication: function (publication) {
                $http({
                    method: 'DELETE',
                    url: '/author/' + this.id + '/publication/' + publication.id
                }).then(
                    function success(response) {
                        console.log('success remove publication');
                        console.log(response.data);
                    },
                    function error(response) {
                        console.log('error remove publication');
                        console.log(response.data);
                    }
                );
            }
        };
        return Author;
    }
})();