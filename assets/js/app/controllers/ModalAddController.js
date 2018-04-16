(function () {
    'use strict'

    angular.module('Library').controller('ModalAddController', ModalAddController);

    ModalAddController.$inject = ['$scope', '$uibModalInstance', 'callbackAdd'];
    function ModalAddController($scope, $uibModalInstance, callbackAdd) {
        $scope.obj = {};

        // вернуть созданный объект
        $scope.add = function () {
            callbackAdd.run($scope.obj);
            // закрываем модальное окно
            $uibModalInstance.close(obj);
        }

        // отмена
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();