(function () {
    'use strict';

    angular.module('Library').factory('Publication', Publication);

    /**
     * Прототип объекта автор
     */
    Publication.$inject = ['$http', '$window'];
    function Publication($http, $window) {
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
            this.is_wos = undefined;
            this.is_scopus = undefined;
            this.is_doi = undefined;
            this.link = '';
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
            }
        };
        return Publication;
    }
})();