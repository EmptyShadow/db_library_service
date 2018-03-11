/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Авторизация 
     */
    login: function (req, res) {
        // получаем данные из запроса
        let data = {
            login: req.param('login'),
            email: req.param('email'),
            password: md5(req.param('password'))
        }
        // если что то пусто
        if (!data.login || !data.email || !data.password) {
            // то говорим что запрос неверный
            return res.badRequest('Все поля должны быть заполнены!!');
        }

        // по переданным данным ищем пользователя
        User.findOne(data).exec(function (err, user) {
            if (err) {
                return res.serverError(err);
            }

            if (!user) {
                return res.notFound('Неверный логин, почта или пароль!!');
            }

            // создание сессии и кукис

            // Возвращаем данные пользователя
            user.password = '';
            return res.json(user);
        })
    },

    /**
     * Регистрация
     */
    join: function (req, res) {
        // получаем данные из запроса
        let data = {
            login: req.param('login'),
            email: req.param('email'),
            password1: req.param('password1'),
            password2: req.param('password2')
        }

        // если что то пусто
        if (!data.login || !data.email || !data.password1 || !data.password2) {
            // то говорим что запрос неверный
            return res.badRequest('Все поля должны быть заполнены!!');
        }
        // если подтверждение пароля не верное
        if (data.password1 !== data.password2) {
            // то сообщаем об этом
            return res.badRequest('Пароли не совпадают!!');
        }

        // пытаемся найти пользователя у которого логин или почта совпадают с переданными
        User.quary(
            'SELECT * FROM user WHERE user.login = $1 OR user.email = $2 LIMIT 0,1', 
            [data.login, data.email], 
            function (err, user) {
                if (err) {
                    return res.serverError(err);
                }
                // если пользователь нашелся
                if (user) {
                    // формируем ответ, что совпало
                    let errRes = {
                        errLogin: data.login === user.login ? 'Логин занят!!' : '',
                        errEmail: data.email === user.email ? 'Почта занята!!' : ''
                    };
                    return res.badRequest(errRes);
                }
                
                data.password = md5(data.password1);
                // создаем нового пользователя
                User.create(data).exec(function (err, newUser) {
                    if (err) {
                        return res.serverError(err);
                    }
                    if (!newUser) {
                        if (err) {
                            return res.serverError({err: 'Неудалось создать пользователя!!', data});
                        }
                    }

                    // возвращаем данные нового пользователя
                    newUser.password = '';
                    return res.json(newUser);
                });
            }
        );
    }
};
