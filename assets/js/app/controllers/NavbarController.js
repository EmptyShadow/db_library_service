(function () {
    'use strict';

    angular.module('Library').controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', '$http', '$cookies'];
    function NavbarController($scope, $http, $cookies) {
        
        $scope.userAuth = $cookies.get('user') != undefined;
        console.log($scope.userAuth);
        
        $http({
            method: 'GET',
            url: '/navs'
        }).then(function success(response) {
            console.log(response);
            return $scope.navs = response.data;
        });
    };
})();