/**
 * NavbarControllerController
 *
 * @description :: Server-side logic for managing Navbarcontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getNavs: function (req, res) {
        /* if (!req.session.logged_in) {
            return res.json([]);
        } */
        let navs = [
            {
                title: 'Авторы',
                link: '/authors'
            },
            {
                title: 'Издания',
                link: '/editions'
            }
        ];
        if (req.session.logged_in && req.session.curUser.is_admin) {
            navs.push({
                title: 'Пользователи',
                link: '/users'
            });
        }

        return res.json(navs);
    }
};

