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
            return res.badRequest('Все поля должны быть заполнены!!');
        }
        return res.view('homepage');
    },

    join: function (req, res) {
        let data = {
            login: req.param('login'),
            email: req.param('email'),
            password1: req.param('password1'),
            password2: req.param('password2')
        }
        if (!data.login || !data.email || !data.password1 || !data.password2) {
            return res.badRequest('Все поля должны быть заполнены!!');
        }
        return res.view('homepage');
    }
};
