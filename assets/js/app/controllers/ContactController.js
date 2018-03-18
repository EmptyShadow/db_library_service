(function () {
    'use strict';

    angular.module('Library').controller('ContactController', ContactController);

    ContactController.$inject = ['$scope', '$http'];
    function ContactController($scope, $http) {
        $http({
            method: 'GET',
            url: '/contacts'
        }).then(function success(response) {
            console.log(response);
            return $scope.contacts = response.data;
        });
    };
})();