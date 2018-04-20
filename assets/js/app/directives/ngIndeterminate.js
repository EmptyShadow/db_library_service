(function () {
    'use strict';

    angular.module('Library').directive('ngIndeterminate', ngIndeterminate);

    ngIndeterminate.$inject = [];
    function ngIndeterminate() {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                scope.$watch(attributes['ngIndeterminate'], function (value) {
                    element.prop('indeterminate', value);
                });
            }
        };
    }
})();