(function () {
    'use strict'

    angular.module('Library').controller('ModalUpdateController', ModalUpdateController);

    ModalUpdateController.$inject = ['$scope', '$uibModalInstance', 'obj'];
    function ModalUpdateController($scope, $uibModalInstance, obj) {
        // пересоздаю пользователя, для того что бы не затереть старые данные
        $scope.obj = obj.copy();

        // обновление данных
        $scope.add = function () {
            // проверяем правильность данных
            if ($scope.obj.isAvailable()) {
                // обновляем данные на сервере
                obj.update($scope.obj, function (err, updatedObj) {
                    if (!err) {
                        // меняем данные в основном объекте
                        obj.setData(updatedObj);
                        // закрываем модальное окно
                        $uibModalInstance.close(updatedObj);
                    } else {
                        $scope.err = err;
                    }
                });
            } else {
                $scope.err = 'Неверные данные';
            }
        }

        // отмена
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();