(function () {
    'use strict';

    angular.module('Library').controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', '$http', '$cookies'];
    function NavbarController($scope, $http, $cookies) {
        
        let cookie = $cookies.get('user');
        $scope.userAuth = cookie != undefined;
        if ($scope.userAuth) {
            $scope.user = angular.fromJson(cookie.substring(2));
            console.log($scope.user);
        }
        
        $http({
            method: 'GET',
            url: '/navs'
        }).then(function success(response) {
            for(let i = 0; i < response.data.length; i++) {
                response.data[i].link = 'home' + response.data[i].link.replace('/', '.');
            }
            console.log(response);
            return $scope.navs = response.data;
        });
    };
})();