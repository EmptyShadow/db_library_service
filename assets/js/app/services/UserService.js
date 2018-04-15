(function () {
    'use strict';

    angular.module('Library')
    .factory('User', User);

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
                return
            }
            this.id = "";
            this.login = "";
            this.email = "";
            this.password = "";
            this.confirmation = "";
            this.is_admin = false;
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
                this.defValErrors();
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
            /**
             * Регистрация
             */
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
            },
            /**
             * Поиск пользователей подпадающих под описание этого пользователя
             */
            search: function (callback) {
                let user = this;
                $http({
                    method: 'POST',
                    url: '/users/search',
                    data: this,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(response) {
                    callback(user.createdIsArray(response.data));
                }, function error(response) {
                    callback([]);
                });
            },
            createdIsArray: function (data) {
                let users = [];
                for (let i = 0; i < data.length; i++) {
                    users.push(new User(data[i]));
                }
                return users;
            },
            update: function (callback) {
                let user = this;
                $http({
                    method: 'POST',
                    url: '/user/update',
                    data: this,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(response) {
                    callback(new User(response.data));
                }, function error(response) {
                    callback(null, response.data);
                });
            },
            defValErrors: function () {
                this.error = '';
                this.errorEmail = '';
                this.errorLogin = '';
                this.errorPassword = '';
            },
            remove: function () {
                $http({
                    method: 'DELETE',
                    url: '/user/' + this.id
                }).then(function success(response) {
                    console.log('Был удален пользователь');
                    console.log(this);
                }, function error(response) {
                    console.log("ошибка удаления");
                });
            },
            toString: function () {
                return this.login;
            },
            changePassword: function (newPassword) {
                console.log(newPassword);
                $http({
                    method: 'POST',
                    url: '/user/' + this.id + '/change_password',
                    data: newPassword,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function success(response) {
                    newPassword.success = "Пароль изменен!!";
                    newPassword.error = '';
                }, function error(response) {
                    newPassword.success = '';
                    newPassword.error = response.data;
                });
            }

        };
        return User;
    }
})();