(function () {
    'use strict'

    angular.module('Library').controller('ModalAddController', ModalAddController);

    ModalAddController.$inject = ['$scope', '$uibModalInstance'];
    function ModalAddController($scope, $uibModalInstance) {
        // пересоздаю пользователя, для того что бы не затереть старые данные
        $scope.obj = {};

        // обновление данных
        $scope.add = function () {
            // закрываем модальное окно
            $uibModalInstance.close($scope.obj);
        }

        // отмена
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();