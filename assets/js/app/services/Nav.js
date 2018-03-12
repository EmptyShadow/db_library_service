(function () {
    'use strict';

    angular.module('Library').service('Nav', Nav);

    Nav.$inject = ['$http'];
    function Nav($http) {
        return function ($http) {
            return $http({
                method: 'GET',
                url: '/navs'
            }).then(function success(response) {
                return response;
            });
        };
    };
})();