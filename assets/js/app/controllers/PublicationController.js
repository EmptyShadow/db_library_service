(function () {
    'use strict'

    angular.module('Library').controller('PublicationController', PublicationController);

    PublicationController.$inject = ['$scope', '$uibModal', 'Publication', 'CurUserSystem'];
    function PublicationController($scope, $uibModal, Publication, CurUserSystem) {
        if (CurUserSystem.userAuth) {
            $scope.curUserSystem = CurUserSystem.user;
        }

        $scope.paramsFind = new Publication();

        $scope.newFilterAuthor = function () {
            // добавление нового поля
            if ($scope.paramsFind.authors.length !== 0) {
                let author = $scope.paramsFind.authors[$scope.paramsFind.authors.length - 1];
                if (!author.lastname && !author.firstname && !author.patronymic) {
                    return;
                }
            }
            // вызов модального окна для ввода данных
            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/add-author.html',
                controller: 'ModalAddController',
                size: 'md'
            });
            uibModalInstance.result.then(function (author) {
                // если данные пришли все пустые
                if (!author.lastname && !author.firstname && !author.patronymic) {
                    // то не добавляем фильтр автора
                    return;
                }
                // иначе добавляем
                $scope.paramsFind.authors.push(author);
            }, function (reason) {
            });
        };

        $scope.removeFilterAuthor = function (author) {
            let index = $scope.paramsFind.authors.indexOf(author);
            if (index !== -1) {
                $scope.paramsFind.authors.splice(index, 1);
            }
        }

        $scope.find = function () {
            for (let i = 0; i < $scope.listCheckboxes.length; i++) {
                let cb = $scope.listCheckboxes[i];
                if (cb.isSelected !== undefined) {
                    $scope.paramsFind[cb.id] = cb.isSelected;
                } else {
                    delete $scope.paramsFind[cb.id];
                }
            }

            $scope.paramsFind.find(function callbackFind(err, publications) {
                if (!err) {
                    console.log(publications);
                    $scope.publications = publications;
                }
            });
        }

        $scope.listCheckboxes = [
            {
                isSelected: undefined,
                desc: 'Высшая аттестационная комиссия',
                id: 'is_vak'
            },
            {
                isSelected: undefined,
                desc: 'Российский индекс научного цитирования',
                id: 'is_rince'
            },
            {
                isSelected: undefined,
                desc: 'WOS',
                id: 'is_wos'
            },
            {
                isSelected: undefined,
                desc: 'Публикация в журнале Scope',
                id: 'is_scope'
            },
            {
                isSelected: undefined,
                desc: 'DOI',
                id: 'is_doi'
            }
        ];
    }
})();