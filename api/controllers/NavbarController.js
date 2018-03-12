/**
 * NavbarControllerController
 *
 * @description :: Server-side logic for managing Navbarcontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getNavs: function (req, res) {
        let navs = [
            {
                title: 'Пользователи',
                link: '/users'
            },
            {
                title: 'Авторы',
                link: '/authors'
            },
            {
                title: 'Издания',
                link: '/editions'
            },
            {
                title: 'Публикации',
                link: '/publications'
            }
        ];

        return res.json(navs);
    }
};

