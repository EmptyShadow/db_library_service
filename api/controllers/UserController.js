/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    login: function (req, res) {
        let data = {
            login: req.param('login'),
            email: req.param('email'),
            password: req.param('password')
        }
        if (!data.login || !data.email || !data.password) {
            return res.view('forms/signin', {login: data.login, email: data.email, errorLogin: 'Неправильный логин, email или пароль!!'});
        }
    },

    join: function (req, res) {
        return res.ok('ok!!');
    }
};
