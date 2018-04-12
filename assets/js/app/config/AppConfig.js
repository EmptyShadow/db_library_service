/**
 * Конфигурация роутинга приложения
 */

(function () {
    'use strict';

    angular.module('Library').config(AppConfig);

    /*AppConfig.$inject = ['$routeProvider'];
    function AppConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                //controller: 'HomeController'
            })
    };*/
    AppConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function AppConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html'
            })
            .state('home.login', {
                url: 'login',
                templateUrl: 'views/forms/signin.html'
            })
            .state('home.join', {
                url: 'join',
                templateUrl: 'views/forms/signup.html'
            })
            .state('home.logout', {
                controller: 'UserController',
                action: 'logout',
                url: 'logout',
                templateUrl: 'views/home.html'
            })
            .state('home.users', {
                url: 'users',
                templateUrl: 'views/lists/users.html'
            })
            .state('home.authors', {
                url: 'authors',
                templateUrl: 'views/lists/authors.html'
            });
        $urlRouterProvider.otherwise('/');
    };
})();