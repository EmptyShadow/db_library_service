(function () {
    'use strict'

    angular.module('Library').controller('ModalRemoveController', ModalRemoveController);

    ModalRemoveController.$inject = ['$scope', '$uibModalInstance', 'obj', 'view', 'array'];
    function ModalRemoveController($scope, $uibModalInstance, obj, view, array) {
        $scope.title = view.title;
        $scope.message = view.message;

        // удалить субъект
        $scope.remove = function () {
            // удаляю объект из массива если он массив есть
            if (array != undefined) {
                let arrayObjs = array;
                let index = arrayObjs.indexOf(obj);
                if (index !== -1) {
                    arrayObjs.splice(index, 1);
                }
            }
            // удаляю объект на сервере
            obj.remove(function (err) {
                if (!err) {
                    // закрываем модальное окно
                    $uibModalInstance.close();
                } else {
                    $scope.err = err;
                }
            });
        }

        // отмена
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();