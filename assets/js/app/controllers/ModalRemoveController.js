(function () {
    'use strict'

    angular.module('Library').controller('ModalRemoveController', ModalRemoveController);

    ModalRemoveController.$inject = ['$scope', '$uibModalInstance', 'obj', 'view', 'callbackRemove'];
    function ModalRemoveController($scope, $uibModalInstance, obj, view, callbackRemove) {
        $scope.title = view.title;
        $scope.message = view.message;

        // удалить субъект
        $scope.remove = function () {
            callbackRemove.run(obj);
            // закрываем модальное окно
            $uibModalInstance.close(obj);
        }

        // отмена
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();