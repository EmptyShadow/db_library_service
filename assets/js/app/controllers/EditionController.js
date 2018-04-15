(function () {
    'use strict'

    angular.module('Library').controller('EditionController', EditionController);

    EditionController.$inject = ['$scope', '$uibModal', 'Edition'];
    function EditionController($scope, $uibModal, Edition) {
        $scope.paramsFind = {
            id: '',
            title: {
                lang: '',
                name: ''
            }
        }
        $scope.editions = [];
        $scope.callbackEditionsFinded = function (err, editions) {
            console.log(editions);
            $scope.editions = editions;
        };

        let edition = new Edition();
        $scope.edition = edition;
    }
})();