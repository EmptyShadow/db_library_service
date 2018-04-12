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
            }
        };
        return Author;
    }
})();