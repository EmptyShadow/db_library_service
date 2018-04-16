(function () {
    'use strict'

    angular.module('Library').controller('ModalUpdateController', ModalUpdateController);

    ModalUpdateController.$inject = ['$scope', '$uibModalInstance', 'obj'];
    function ModalUpdateController($scope, $uibModalInstance, obj) {
        // пересоздаю пользователя, для того что бы не затереть старые данные
        $scope.obj = obj.copy();

        // обновление данных
        $scope.update = function () {
            // проверяем правильность данных
            if ($scope.obj.isAvailable()) {
                // отсылаем данные на сервер для обновления
                $scope.obj.update(function (OkPacket, err) {
                    if (err) {
                        $scope.obj.error = err;
                        return
                    }
                    
                    if (!OkPacket) {
                        $scope.obj.error = 'Изменения не полученны!!';
                        return
                    }

                    // применяем измененные данные
                    obj.setData($scope.obj);
                    // закрываем модальное окно
                    $uibModalInstance.close(obj);
                });
            }
        }

        // отмена
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();