(function () {
    'use strict';

    angular.module('Library').factory('User', User);

    /**
     * Прототип объекта пользователь
     */
    User.$inject = ['$http', '$window'];
    function User($http, $window) {
        /**
         * Конструктор объекта
         * @param {Данные пользователя} dataUser 
         */
        function User(dataUser) {
            if (dataUser) {
                this.setData(dataUser);
            }
            this.login = "";
            this.email = "";
            this.password = "";
            this.errorLogin = "";
        };

        /**
         * Прототип, в котором содержатся методы
         */
        User.prototype = {
            /**
             * Изменить данные
             */
            setData: function (dataUser) {
                angular.extend(this, dataUser);
            },
            /**
             * Авторизация
             */
            auth: function () {
                let validUser = this.isAvailable;
                if (!validUser) { return false; }

                let user = this;
                $http({
                    method: 'POST',
                    url: '/user/login',
                    data: this,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(response) {
                    /*user.setData(response.data);
                    user.errorLogin = '';*/
                    $window.location.href = '/';
                }, function error(response) {
                    user.errorLogin = response.data;
                });
            },
            /**
             * Валидация данных пользователя
             */
            isAvailable: function () {
                if (!this.login || !this.email || !this.password) {
                    return false;
                }

                return this.isAvailableEmaill();
            },
            /**
             * Валидация адреса почты
             */
            isAvailableEmail: function ValidateEmail() {
                // проверка существования 1 амперсанта в адресе почты
                let countAmpersantsInEmail = -1;
                let indexAmpers = -1;
                do {
                    countAmpersantsInEmail++;
                    indexAmpers++;
                    indexAmpers = this.email.indexOf('@', indexAmpers);

                    if (countAmpersantsInEmail == 2) { break; }


                } while (indexAmpers != -1);

                if (countAmpersantsInEmail != 1) {
                    return false;
                }

                return true;
            },
            logout: function () {
                $http({
                    method: 'POST',
                    url: '/user/logout',
                }).then(function success(response) {
                    $window.location.href = '/';
                }, function error(response) {
                    console.log(response.data);
                });
            }
        };
        return User;
    }
})();