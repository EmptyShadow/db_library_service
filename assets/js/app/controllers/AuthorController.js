(function () {
    'use strict'

    angular.module('Library').controller('AuthorController', AuthorController);

    AuthorController.$inject = ['$scope', '$uibModal', 'Author'];
    function AuthorController($scope, $uibModal, Author) {
        $scope.paramsFind = {
            id: '',
            name: {
                lang: '',
                firstname: '',
                patronymic: '',
                lastname: ''
            }
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