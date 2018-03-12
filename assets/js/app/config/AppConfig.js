/**
 * Конфигурация роутинга приложения
 */

(function () {
    'use strict';

    angular.module('Library').config(AppConfig);

    AppConfig.$inject = ['$routeProvider'];
    function AppConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                //controller: 'HomeController'
            })
    };
})();