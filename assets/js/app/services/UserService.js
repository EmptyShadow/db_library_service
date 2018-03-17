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
            this.login = "admin";
            this.email = "email@admin";
            this.password = "";
            this.confirmation = "";
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
                let validUser = this.isAvailable() && this.password;
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
                if (!this.login || !this.email) {
                    this.errorLogin = 'Все поля должны быть заполнены!!';
                    return false;
                }

                return this.isAvailableEmail();
            },
            /**
             * Валидация адреса почты
             */
            isAvailableEmail: function () {
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
                    this.errorLogin = 'Неправильная почта!!';
                    return false;
                }

                return true;
            },
            /**
             * Выход пользователя
             */
            logout: function () {
                $http({
                    method: 'POST',
                    url: '/user/logout',
                }).then(function success(response) {
                    $window.location.href = '/';
                }, function error(response) {
                    console.log(response.data);
                });
            },
            join: function () {
                let validUser = this.isAvailable() && this.password && this.confirmation;
                if (!validUser) { return false; }

                if (this.password != this.confirmation) {
                    this.errorPassword = 'Пароли должны совпадать';
                    return false;
                }

                let user = this;
                $http({
                    method: 'POST',
                    url: '/user/join',
                    data: this,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(response) {
                    /*user.setData(response.data);
                    user.errorLogin = '';*/
                    $window.location.href = '/';
                }, function error(response) {
                    user.error = response.data.error;
                    user.errorLogin = response.data.errorLogin;
                    user.errorEmail = response.data.errorEmail;
                    user.errorPassword = response.data.errorPassword;
                });
            }
        };
        return User;
    }
})();