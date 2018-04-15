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
            }
        };
        return Edition;
    }
})();