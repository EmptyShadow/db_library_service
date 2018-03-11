/**
 * AuthorController
 *
 * @description :: Server-side logic for managing Authors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	login: function (req, res) {

        let data = {
            login: req.params('login'),
            email: req.params('email'),
            password: md5(req.params('password'))
        };

        User.findOne(data).exec(function (err, user) {
            if (err) {
                return res.serverError(err);
            }

            if (!user) {
                return res.notFound('Неверный логин, почта или пароль!!');
            }

            // создание сессии и кукис

            return res.json(user);
        })
    }
};

