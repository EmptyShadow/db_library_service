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
            console.log(authors);
            $scope.authors = authors;
        };

        let author = new Author();
        $scope.author = author;

        $scope.createAuthor = function () {
            let uibModalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/modals/author.html',
                controller: 'ModalAddController',
                size: 'lg'
            });
            uibModalInstance.result.then(function (data) {
                // если что то пришло пустое
                if (!data.lang || !data.lastname || !data.firstname || !data.patronymic) {
                    // то не добавляем автора
                    return;
                }

                // добавляем автора
                let author = new Author(data);
                author.create(function (err, author) {
                    if (err) {
                        console.log(err);
                    }
                    $scope.authors.push(author);
                });
            }, function (reason) {
            });
        };

        $scope.addAuthorName = function (author) {
            let uibModalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/modals/author.html',
                controller: 'ModalAddController',
                size: 'lg'
            });
            uibModalInstance.result.then(function (data) {
                // если что то пришло пустое
                if (!data.lang || !data.lastname || !data.firstname || !data.patronymic) {
                    // то не добавляем автора
                    return;
                }

                author.addName(data, function (err, name) {
                    if (err) {
                        console.log(err);
                    }
                    author.names.push(name);
                });
            }, function (reason) {
            });
        };

        $scope.updateAuthorName = function (author, name) {
            name.update = author.updateName;
            name.setData = function (data) {
                angular.extend(this, data);
            };
            name.copy = function () {
                return {
                    lang: this.lang,
                    firstname: this.firstname,
                    lastname: this.lastname,
                    patronymic: this.patronymic,
                    id: this.id,
                    isAvailable: function () {
                        if (!this.lang || !this.lastname || !this.firstname || !this.patronymic) {
                            // то не добавляем автора
                            return false;
                        }
                        return true;
                    },
                    update: author.updateName
                }
            };
            let uibModalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'views/modals/author.html',
                controller: 'ModalUpdateController',
                size: 'md',
                resolve: {
                    obj: name
                }
            });
            uibModalInstance.result.then(function (data) {
                let index = author.names.indexOf(name);
                author.names[index] = data;
            }, function (reason) {
            });
        };

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
                    array: function () {
                        return $scope.authors;
                    }
                }
            });
            uibModalInstance.result.then(function () {
            }, function (reason) {
            });
        };

        $scope.removeName = function (author, name) {
            if (author.names.length > 1) {
                name.remove = function (callback) {
                    author.removeName(name, callback);
                }
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
                        array: function () {
                            return author.names;
                        }
                    }
                });
                uibModalInstance.result.then(function () {
                }, function (reason) {
                });
            } else {
                $scope.removeAuthor(author);
            }
        };

        $scope.removePublication = function (author, publication) {
            publication.remove = function (callback) {
                author.removePublication(publication, callback);
            }
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
                    array: function () {
                        return author.publications;
                    }
                }
            });
            uibModalInstance.result.then(function () {
            }, function (reason) {
            });
        };
    }
})();