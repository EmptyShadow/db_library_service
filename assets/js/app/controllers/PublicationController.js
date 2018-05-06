(function () {
    'use strict'

    angular.module('Library').controller('PublicationController', PublicationController);

    PublicationController.$inject = ['$scope', '$uibModal', 'Publication', 'CurUserSystem', 'Edition', 'TypePublication'];
    function PublicationController($scope, $uibModal, Publication, CurUserSystem, Edition, TypePublication) {
        if (CurUserSystem.userAuth) {
            $scope.curUserSystem = CurUserSystem.user;
        }

        $scope.publications = [];
        $scope.authors = [];
        (new TypePublication()).find(function (err, data) {
            if (!err) {
                $scope.listTypesPub = data;
            }
        });

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
            }
        ];

        $scope.createPublication = function () {
            let listTypesPub = $scope.listTypesPub;
            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/add-publication.html',
                controller: function ($uibModalInstance, $scope) {
                    $scope.obj = new Publication();
                    $scope.listCheckboxes = [
                        {
                            desc: 'Высшая аттестационная комиссия',
                            id: 'is_vak'
                        },
                        {
                            desc: 'Российский индекс научного цитирования',
                            id: 'is_rince'
                        }
                    ];
                    $scope.listCheckboxes.forEach(element => {
                        $scope.obj[element.id] = false;
                    });
                    $scope.listTypesPub = listTypesPub;
                    $scope.add = function () {
                        console.log($scope.obj);
                        if ($scope.obj.datepub != undefined
                            && $scope.obj.title.lang != undefined
                            && $scope.obj.title.title != undefined
                            && $scope.obj.type != undefined) {
                            $scope.obj.createPublication(function (err, newPublication) {
                                $uibModalInstance.close(newPublication);
                            });
                        }
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'lg'
            });
            uibModalInstance.result.then(function (publication) {
                $scope.publications.push(publication);
            }, function (reason) {
            });
        };

        $scope.updatePublication = function (publication) {
            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/update-publication.html',
                controller: function ($uibModalInstance, $scope) {
                    $scope.obj = publication;
                    $scope.listCheckboxes = [
                        {
                            desc: 'Высшая аттестационная комиссия',
                            id: 'is_vak'
                        },
                        {
                            desc: 'Российский индекс научного цитирования',
                            id: 'is_rince'
                        },
                        {
                            desc: 'WOS',
                            id: 'is_wos'
                        },
                        {
                            desc: 'Публикация в журнале Scope',
                            id: 'is_scope'
                        },
                        {
                            desc: 'DOI',
                            id: 'is_doi'
                        }
                    ];
                    $scope.update = function () {
                        if ($scope.obj.datepub != undefined
                            && $scope.obj.link != undefined
                            && $scope.obj.type != undefined) {
                            $scope.obj.updatePublication(function (err) {
                                if (!err) {
                                    $uibModalInstance.close($scope.obj);
                                }
                            })
                        }
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'lg'
            });
            uibModalInstance.result.then(function () {
            }, function (reason) {
            });
        };

        $scope.removePublication = function (publication) {
            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/remove.html',
                controller: 'ModalRemoveController',
                size: 'sm',
                resolve: {
                    obj: publication,
                    view: {
                        title: 'Удалить публикацию',
                        message: 'Вы действительно хотите удалить публикацию ' + publication.titles[0].title + '?'
                    },
                    array: function () {
                        return $scope.publications;
                    }
                }
            });
            uibModalInstance.result.then(function () {
            }, function (reason) {
            });
        };

        $scope.createPublicationTitle = function (publication) {
            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/title-publication.html',
                controller: function ($uibModalInstance, $scope) {
                    $scope.obj = {};

                    $scope.add = function () {
                        console.log($scope.obj);
                        if ($scope.obj.lang != undefined
                            && $scope.obj.title != undefined) {
                            publication.createPublicationTitle($scope.obj, function (err, title) {
                                $uibModalInstance.close(title);
                            });
                        }
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'md'
            });
            uibModalInstance.result.then(function (title) {
                publication.titles.push(title);
            }, function (reason) {
            });
        };

        $scope.updatePublicationTitle = function (publication, title) {
            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/title-publication.html',
                controller: function ($uibModalInstance, $scope) {
                    $scope.obj = {
                        id: title.id,
                        lang: title.lang,
                        title: title.title
                    };

                    $scope.add = function () {
                        if ($scope.obj.lang != undefined
                            && $scope.obj.title != undefined) {
                            publication.updatePublicationTitle($scope.obj, function (err, title) {
                                if (!err) {
                                    $uibModalInstance.close(title);
                                }
                            });
                        }
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'md'
            });
            uibModalInstance.result.then(function (updateTitle) {
                let index = publication.titles.indexOf(title);
                if (index != -1) {
                    publication.titles[index] = updateTitle;
                }
            }, function (reason) {
            });
        };

        $scope.removePublicationTitle = function (publication, title) {
            if (publication.titles.length == 1) {
                $scope.removePublication(publication);
                return;
            }

            title.remove = function (callback) {
                publication.removePublicationTitle(title, callback);
            };

            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/remove.html',
                controller: 'ModalRemoveController',
                size: 'sm',
                resolve: {
                    obj: title,
                    view: {
                        title: 'Удалить название публикации',
                        message: 'Вы действительно хотите удалить название публикации ' + title.title + '?'
                    },
                    array: function () {
                        return publication.titles;
                    }
                }
            });
            uibModalInstance.result.then(function () {
            }, function (reason) {
            });
        };

        $scope.addAuthor = function (publication) {
            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/input-number.html',
                controller: function ($uibModalInstance, $scope) {
                    $scope.view = {
                        title: 'Добавить автора публикации',
                        labelNumber: 'Индентификатор автора'
                    };

                    $scope.add = function () {
                        if ($scope.number != undefined) {
                            (new Publication).addAuthor(publication.id, $scope.number, function (err, author) {
                                if (err) {
                                    $scope.err = err;
                                    return;
                                }

                                $uibModalInstance.close(author);
                            })
                        }
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'sm'
            });
            uibModalInstance.result.then(function (author) {
                publication.authors.push(author);
            }, function (reason) {
            });
        };

        $scope.removeAuthor = function (publication, author) {
            author.remove = function (callback) {
                publication.removeAuthor(publication.id, author.id, callback);
            };

            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/remove.html',
                controller: 'ModalRemoveController',
                size: 'sm',
                resolve: {
                    obj: author,
                    view: {
                        title: 'Исключить автора',
                        message: 'Вы действительно хотите исключить автора '
                            + author.names[0].lastname + ' ' + author.names[0].firstname + ' ' + author.names[0].patronymic
                            + ' из авторов публикации ' + publication.titles[0].title + '?'
                    },
                    array: function () {
                        return publication.authors;
                    }
                }
            });
            uibModalInstance.result.then(function () {
            }, function (reason) {
            });
        };

        $scope.replaceEditor = function (publication) {
            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/input-number.html',
                controller: function ($uibModalInstance, $scope) {
                    $scope.view = {
                        title: 'Добавить издание публикации',
                        labelNumber: 'Индентификатор издания'
                    };

                    $scope.add = function () {
                        if ($scope.number != undefined) {
                            (new Publication).replaceEditor(publication.id, $scope.number, function (err, editor) {
                                if (err) {
                                    $scope.err = err;
                                    return;
                                }

                                $uibModalInstance.close(editor);
                            })
                        }
                    };
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'sm'
            });
            uibModalInstance.result.then(function (editor) {
                publication.editor = editor;
            }, function (reason) {
            });
        };

        $scope.removeEditor = function (publication, editor) {
            editor.remove = function (callback) {
                publication.removeEditor(publication.id, callback);
            };

            let uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/remove.html',
                controller: 'ModalRemoveController',
                size: 'sm',
                resolve: {
                    obj: editor,
                    view: {
                        title: 'Исключить издание',
                        message: 'Вы действительно хотите исключить издание '
                            + editor.titles[0].name
                            + ' из публикации ' + publication.titles[0].title + '?'
                    },
                    array: function () {
                        return [];
                    }
                }
            });
            uibModalInstance.result.then(function () {
                delete publication.editor;
            }, function (reason) {
            });
        };

        $scope.setGOST = function (publication) {
            let gost = '';
            for (let i = 0; i < publication.authors.length; i++) {
                let author = publication.author[i];
                gost += author.lastname + ' ' + author.firstname.charAt(0) + '. ' + author.patronymic.charAt(0) + '.';
                if (i + 1 == publication.authors.length) {
                    gost += ', ';
                } else {
                    gost += ' ';
                }
            }

            gost += publication.titles[0].title;

            if (publication.dataout) {
                gost += ' ' + publication.dataout;
            }

            let indexed = [];
            if (publication.doi) { indexed.push('DOI: ' + publication.doi); }
            if (publication.scopus_id) { indexed.push('Scopus id: ' + publication.scopus_id); }
            if (publication.wos) { indexed.push('WOS: ' + publication.wos); }
            if (publication.isbn) { indexed.push('ISBN: ' + publication.isbn); }

            if (indexed.length != 0) {
                gost += ' (';
                for (let i = 0; i < indexed.length; i++) {
                    gost += indexed[i];
                    if (i + 1 != indexed.length) {
                        gost += ', ';
                    }
                }
                gost += ')';
            }

            $scope.gost = gost;
        }
    }
})();