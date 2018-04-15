(function () {
    'use strict';

    angular.module('Library')
        .service('CurUserSystem', CurUserSystem);

    /**
     * Прототип объекта пользователь
     */
    CurUserSystem.$inject = ['$cookies', 'User'];
    function CurUserSystem($cookies, User) {
        this.userAuth = false;
        let cookie = $cookies.get('user');
        
        if (cookie != undefined) {
            this.userAuth = true;
            this.user = new User(angular.fromJson(cookie.substring(2)));
        }
    }
})();