(function () {
    'use strict'

    angular.module('Library').controller('UserController', UserController);

    UserController.$inject = ['$scope', 'User'];
    function UserController($scope, User) {
        $scope.users = [];
        $scope.usersParams = new User();
        /* $scope.maxPrintCount = 50;
        $scope.currentListUsers = 1;

        $scope.listNext = function () {
            if ($scope.currentListUsers < $scope.maxNumberList) {
                $scope.currentListUsers++;
            }
        } */

        $scope.search = function () {
            $scope.usersParams.search(function callbackUsers(users) {
                console.log(users);
                $scope.users = users;
            });
        }
    }
})();