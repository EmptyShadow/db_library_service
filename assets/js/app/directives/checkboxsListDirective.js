(function () {
    'use strict';

    angular.module('Library').directive('listCheckboxs', listCheckboxs);

    listCheckboxs.$inject = ['$window'];
    function listCheckboxs($window) {
        return {
            replace: true,
            restrict: 'E',
            scope: { checkboxes: '=' },
            template: '<div class="form-inline mb-3">'
                + '<div class="form-check ml-2">'
                + '<div class="custom-control custom-checkbox">'
                + '<input type="checkbox" class="custom-control-input" id="master" ng-model="master" ng-change="masterChange()">'
                + '<label class="custom-control-label" for="master" ng-if="master">Снять со всех выбор</label>'
                + '<label class="custom-control-label" for="master" ng-if="!master">Выбрать все</label>'
                + '</div>'
                + '</div>'
                + '<div ng-repeat="cb in checkboxes">'
                + '<div class="form-check ml-2">'
                + '<div class="custom-control custom-checkbox">'
                + '<input type="checkbox" class="custom-control-input" id="checkbox{{$index}}" ng-model="cb.isSelected" ng-change="cbChange()" ng-click="click($event, cb)" ng-indeterminate="true">'
                + '<label class="custom-control-label" for="checkbox{{$index}}">{{ cb.desc }}</label>'
                + '</div>'
                + '</div>'
                + '</div><small class="form-text text-muted ml-2">Ctr + mouse button Left исключает чекбокс</small>'
                + '</div>',
            controller: function ($scope, $element) {
                $scope.master = false;
                $scope.masterChange = function () {
                    //let elements = angular.element('input.custom-control-input');
                    if ($scope.master) {
                        angular.forEach($scope.checkboxes, function (cb, index) {
                            if (cb.isSelected != undefined) {
                                cb.isSelected = true;
                            }
                        });
                    } else {
                        angular.forEach($scope.checkboxes, function (cb, index) {
                            if (cb.isSelected != undefined) {
                                cb.isSelected = false;
                            }
                        });
                    }
                };

                let masterCb = $element.children()[0].getElementsByTagName("input")[0];
                $scope.cbChange = function () {
                    let allSet = true, allClear = true;
                    angular.forEach($scope.checkboxes, function (cb, index) {
                        if (cb.isSelected) {
                            allClear = false;
                        } else {
                            allSet = false;
                        }
                    });
                    if (allSet) {
                        $scope.master = true;
                        masterCb.indeterminate = false;
                    }
                    else if (allClear) {
                        $scope.master = false;
                        masterCb.indeterminate = false;
                    }
                    else {
                        $scope.master = false;
                        masterCb.indeterminate = true;
                    }
                };
                $scope.cbChange();  // initialize

                $scope.click = function (event, cb) {
                    if (event.ctrlKey) {
                        cb.isSelected = undefined;
                        event.currentTarget.indeterminate = true;
                    }
                }
            }
        };
    }
})();