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
    }
})();