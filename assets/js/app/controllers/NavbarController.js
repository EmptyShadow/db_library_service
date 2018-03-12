(function () {
    'use strict';

    angular.module('Library').controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', '$http'];
    function NavbarController($scope, $http) {
        $http({
            method: 'GET',
            url: '/navs'
        }).then(function success(response) {
            console.log(response);
            return $scope.navs = response.data;
        });
    };
})();