(function () {
    'use strict';

    angular.module('Library').controller('ContactController', ContactController);

    ContactController.$inject = ['$scope', '$http'];
    function ContactController($scope, $http) {
        $http({
            method: 'GET',
            url: '/contacts'
        }).then(function success(response) {
            return $scope.contacts = response.data;
        });
    };
})();