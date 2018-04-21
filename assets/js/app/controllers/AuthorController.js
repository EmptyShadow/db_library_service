(function () {
    'use strict'

    angular.module('Library').controller('AuthorController', AuthorController);

    AuthorController.$inject = ['$scope', '$uibModal', 'Author', 'CurUserSystem'];
    function AuthorController($scope, $uibModal, Author, CurUserSystem) {
        $scope.paramsFind = {
            id: '',
            name: {
                lang: '',
                firstname: '',
                patronymic: '',
                lastname: ''
            }
        }
        if (CurUserSystem.userAuth) {
            $scope.curUserSystem = CurUserSystem.user;
        }
        $scope.authors = [];
        $scope.callbackAuthorsFinded = function (err, authors) {
            $scope.authors = authors;
        };

        let author = new Author();
        $scope.author = author;

        $scope.removeAuthor = function (author) {
            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/remove.html',
                controller: 'ModalRemoveController',
                size: 'sm',
                resolve: {
                    obj: author,
                    view: {
                        title: 'Удалить автора',
                        message: 'Вы действительно хотите удалить автора '
                            + author.names[0].lastname + ' ' + author.names[0].firstname + ' ' + author.names[0].patronymic + '?'
                    },
                    callbackRemove: {
                        run: function callbackRemove(author) {
                            author.remove();
                            let index = $scope.authors.indexOf(author);
                            if (index !== -1) {
                                $scope.authors.splice(index, 1);
                            }
                        }
                    }
                }
            });
        }

        $scope.removeName = function (author, name) {
            if (author.names.length > 1) {
                let uibModalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/modals/remove.html',
                    controller: 'ModalRemoveController',
                    size: 'sm',
                    resolve: {
                        obj: name,
                        view: {
                            title: 'Удалить псевдоним автора',
                            message: 'Вы действительно хотите удалить псевдоним '
                                + name.lastname + ' ' + name.firstname + ' ' + name.patronymic + '?'
                        },
                        callbackRemove: {
                            run: function callbackRemove(name) {
                                author.removeName(name);
                                let index = author.names.indexOf(name);
                                if (index !== -1) {
                                    author.names.splice(index, 1);
                                }
                            }
                        }
                    }
                });
            } else {
                $scope.removeAuthor(author);
            }
        }

        $scope.removePublication = function (author, publication) {
            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/remove.html',
                controller: 'ModalRemoveController',
                size: 'sm',
                resolve: {
                    obj: publication,
                    view: {
                        title: 'Исключить авторство',
                        message: 'Вы действительно хотите исключить автора '
                            + author.names[0].lastname + ' ' + author.names[0].firstname + ' ' + author.names[0].patronymic 
                            + ' из авторов публикации ' + publication.titles[0].title + '?'
                    },
                    callbackRemove: {
                        run: function callbackRemove(publication) {
                            author.removePublication(publication);
                            let index = author.publications.indexOf(publication);
                            if (index !== -1) {
                                author.publications.splice(index, 1);
                            }
                        }
                    }
                }
            });
        }
    }
})();