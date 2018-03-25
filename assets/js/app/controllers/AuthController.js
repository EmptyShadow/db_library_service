(function (){
    'use strict';

    angular.module('Library').controller('AuthController', AuthController);

    AuthController.$inject = ['$scope', 'User'];
    function AuthController($scope, User) {
        $scope.user = new User();
    };
})();