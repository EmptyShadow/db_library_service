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

        $scope.createEditor = function () {
            let uibModalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/modals/editor.html',
                controller: 'ModalAddController',
                size: 'lg'
            });
            uibModalInstance.result.then(function (data) {
                // если что то пришло пустое
                if (!data.lang || !data.name) {
                    // то не добавляем автора
                    return;
                }

                // добавляем автора
                let editor = new Edition(data);
                editor.create(function (err, editor) {
                    if (err) {
                        console.log(err);
                    }
                    $scope.editions.push(editor);
                });
            }, function (reason) {
            });
        };

        $scope.addEditorTitle = function (editor) {
            let uibModalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/modals/editor.html',
                controller: 'ModalAddController',
                size: 'lg'
            });
            uibModalInstance.result.then(function (data) {
                // если что то пришло пустое
                if (!data.lang || !data.name) {
                    // то не добавляем автора
                    return;
                }

                editor.addTitle(data, function (err, title) {
                    if (err) {
                        console.log(err);
                    }
                    editor.titles.push(title);
                });
            }, function (reason) {
            });
        };

        $scope.updateEditorTitle = function (editor, title) {
            title.update = editor.updateTitle;
            title.setData = function (data) {
                angular.extend(this, data);
            };
            title.copy = function () {
                return {
                    lang: this.lang,
                    name: this.name,
                    id: this.id,
                    isAvailable: function () {
                        if (!this.lang || !this.name) {
                            // то не добавляем автора
                            return false;
                        }
                        return true;
                    },
                    update: editor.updateTitle
                }
            };
            let uibModalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/modals/editor.html',
                controller: 'ModalUpdateController',
                size: 'lg',
                resolve: {
                    obj: title
                }
            });
            uibModalInstance.result.then(function (data) {
                let index = editor.titles.indexOf(title);
                editor.titles[index] = data;
            }, function (reason) {
            });
        };

        $scope.removeEditor = function (editor) {
            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/remove.html',
                controller: 'ModalRemoveController',
                size: 'sm',
                resolve: {
                    obj: editor,
                    view: {
                        title: 'Удалить издание',
                        message: 'Вы действительно хотите удалить издание ' + editor.titles[0].name + '?'
                    },
                    array: function () {
                        return $scope.editions;
                    }
                }
            });
            uibModalInstance.result.then(function () {
            }, function (reason) {
            });
        };

        $scope.removeTitle = function (editor, title) {
            if (editor.titles.length > 1) {
                title.remove = function (callback) {
                    editor.removeTitle(title, callback);
                }
                let uibModalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modals/remove.html',
                    controller: 'ModalRemoveController',
                    size: 'sm',
                    resolve: {
                        obj: title,
                        view: {
                            title: 'Удалить название издания',
                            message: 'Вы действительно хотите удалить название ' + title.name + '?'
                        },
                        array: function () {
                            return editor.titles;
                        }
                    }
                });
                uibModalInstance.result.then(function () {
                }, function (reason) {
                });
            } else {
                $scope.removeEditor(editor);
            }
        };
    }
})();