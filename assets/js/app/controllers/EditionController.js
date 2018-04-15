(function () {
    'use strict'

    angular.module('Library').controller('EditionController', EditionController);

    EditionController.$inject = ['$scope', '$uibModal', 'Edition', 'CurUserSystem'];
    function EditionController($scope, $uibModal, Edition, CurUserSystem) {
        $scope.paramsFind = {
            id: '',
            title: {
                lang: '',
                name: ''
            }
        }

        if (CurUserSystem.userAuth) {
            $scope.curUserSystem = CurUserSystem.user;
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