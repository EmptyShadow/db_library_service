(function () {
    'use strict';

    angular.module('Library').controller('ManualController', ManualController);

    ManualController.$inject = ['$scope', '$http'];
    function ManualController($scope, $http) {
        $http({
            method: 'GET',
            url: '/manual'
        }).then(function success(response) {
            console.log(response);
            return $scope.data = response.data;
        });
    };
})();