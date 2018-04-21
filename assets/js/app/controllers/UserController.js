(function () {
    'use strict'

    angular.module('Library').controller('UserController', UserController);

    UserController.$inject = ['$scope', '$uibModal', 'User', '$cookies', 'CurUserSystem'];
    function UserController($scope, $uibModal, User, $cookies, CurUserSystem) {
        $scope.users = [];
        $scope.usersParams = new User();

        let cookie = $cookies.get('user');
        if (cookie != undefined) {
            $scope.curUser = new User(angular.fromJson(cookie.substring(2)));
            $scope.newPassword = {
                curPassword: '',
                newPassword: '',
                confirmationPassword: '',
                error: '',
                success: ''
            }
        }

        if (CurUserSystem.userAuth) {
            $scope.curUserSystem = CurUserSystem.user;
        }

        /* $scope.maxPrintCount = 50;
        $scope.currentListUsers = 1;

        $scope.listNext = function () {
            if ($scope.currentListUsers < $scope.maxNumberList) {
                $scope.currentListUsers++;
            }
        } */

        $scope.search = function () {
            $scope.usersParams.search(function callbackUsers(users) {
                $scope.users = users;
            });
        }

        $scope.updateUser = function (user) {
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/update-user.html',
                controller: 'ModalUpdateController',
                size: 'md',
                resolve: {
                    obj: user
                }
            });
        }

        $scope.removeUser = function (user) {
            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/remove.html',
                controller: 'ModalRemoveController',
                size: 'sm',
                resolve: {
                    obj: user,
                    view: {
                        title: 'Удалить пользователя',
                        message: 'Вы действительно хотите удалить пользователя ' + user.login + '?'
                    },
                    callbackRemove: {
                        run: function callbackRemove(user) {
                            user.remove();
                            let index = $scope.users.indexOf(user);
                            if (index !== -1) {
                                $scope.users.splice(index, 1);
                            }
                        }
                    }
                }
            });
        }

        $scope.changePassword = function (newPassword) {
            console.log(newPassword);
            if (newPassword.curPassword == newPassword.newPassword) {
                newPassword.error = 'Новый пароль совпадает с текущим!!'
                return;
            } else if (newPassword.newPassword != newPassword.confirmationPassword) {
                newPassword.error = 'Подтверждение нового пароля неверно!!';
                return;
            } else {
                newPassword.error = '';
            }
            $scope.curUser.changePassword(newPassword);
        }
    }
})();