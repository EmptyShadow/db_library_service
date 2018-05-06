(function () {
    'use strict';

    angular.module('Library')
        .service('TypePublication', TypePublication);

    /**
     * Прототип объекта пользователь
     */
    TypePublication.$inject = ['$http'];
    function TypePublication($http) {

        /**
         * Конструктор объекта
         * @param {Данные} data 
         */
        function TypePublication(data) {
            if (data) {
                this.setData(data);
                return
            }

            this.id = undefined;
            this.type = '';
        };

        /**
         * Прототип, в котором содержатся методы
         */
        TypePublication.prototype = {
            /**
            * Изменить данные
            */
            setData: function (data) {
                angular.extend(this, data);
            },
            find: function (callback) {
                let service = this;
                $http({
                    method: 'GET',
                    url: '/typepublication/find'
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
                let types = [];
                for (let i = 0; i < data.length; i++) {
                    types.push(new TypePublication(data[i]));
                }
                return types;
            },
        };
        return TypePublication;
    }
})();