(function (){
    'use strict';

    angular.module('Library').controller('UserController', UserController);

    UserController.$inject = ['$scope', 'User'];
    function UserController($scope, User) {
        $scope.user = new User();
    };
})();