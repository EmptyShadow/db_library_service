(function () {
    'use strict'

    angular.module('Library').controller('ModalRemoveController', ModalRemoveController);

    ModalRemoveController.$inject = ['$scope', '$uibModalInstance', 'obj', 'callbackRemove'];
    function ModalRemoveController($scope, $uibModalInstance, obj, callbackRemove) {
        $scope.obj = obj;

        // удалить субъект
        $scope.remove = function () {
            if (obj.remove !== undefined) {
                obj.remove();
                callbackRemove.run();
                // закрываем модальное окно
                $uibModalInstance.close(obj);
            }
        }

        // отмена
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();