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
            password: req.param('password')
        }


        // если что то пусто
        if (!data.login || !data.email || !data.password) {
            // то говорим что запрос неверный
            return res.badRequest('Все поля должны быть заполнены!!');
        }
        // по переданным данным ищем пользователя
        User.findOne()
            .where({ login: data.login, email: data.email })
            .exec(function (err, user) {
                if (err) {
                    return res.serverError(err);
                }

                if (!user) {
                    return res.notFound('Неверный логин или почта!!');
                }

                BCryptService.compare(data.password, user.password, function (err, resCompare) {
                    if (err) {
                        return res.serverError(err);
                    } if (!resCompare) {
                        return res.badRequest('Неправильный пароль!!');
                    } if (resCompare) {
                        // записываем в сессию что пользователь вошел и записываем его ip
                        req.session.logged_in = true;
                        req.session.ip = req.ip;
                        req.session.curUser = user;

                        // Возвращаем данные пользователя
                        user.password = '';

                        res.cookie('user', user);
                        return res.json(user);
                    };
                });
            });
    },

    /**
     * Выход и уничтожение кукисов
     */
    logout: function (req, res) {
        delete req.session.logged_in;
        delete req.session.ip;
        delete req.session.curUser;

        res.clearCookie('user');

        return res.json({ logout: 'true' });
    },

    /**
     * Регистрация
     */
    join: function (req, res) {
        // получаем данные из запроса
        let data = {
            login: req.param('login'),
            email: req.param('email'),
            password: req.param('password'),
            confirmation: req.param('confirmation')
        }
        // если что то пусто
        if (!data.login || !data.email || !data.password || !data.confirmation) {
            // то говорим что запрос неверный
            return res.badRequest({ error: 'Все поля должны быть заполнены!!' });
        }
        // если подтверждение пароля не верное
        if (data.password !== data.confirmation) {
            // то сообщаем об этом
            return res.badRequest({ errorPassword: 'Пароли не совпадают!!' });
        }

        // пытаемся найти пользователя у которого логин или почта совпадают с переданными
        User.find()
            .where({
                or: [
                    { login: data.login },
                    { email: data.email }
                ]
            })
            .exec(function (err, user) {
                if (err) {
                    return res.serverError(err);
                }
                // если пользователь нашелся
                if (user.length > 0) {
                    // формируем ответ, что совпало
                    let errRes = {
                        errorLogin: data.login == user[0].login ? 'Логин занят!!' : '',
                        errorEmail: data.email == user[0].email ? 'Почта занята!!' : ''
                    };
                    return res.badRequest(errRes);
                }
                // создаем нового пользователя
                User.create(data).exec(function (err, newUser) {
                    if (err) {
                        return res.serverError(err);
                    }
                    if (!newUser) {
                        if (err) {
                            return res.serverError({ err: 'Неудалось создать пользователя!!', data });
                        }
                    }

                    // возвращаем данные нового пользователя
                    newUser.password = '';
                    return res.json(newUser);
                });
            }
            );
    },

    /**
     * Поиск пользователей по признакам
     */
    search: function (req, res) {
        let data = {
            id: req.param('id'),
            login: req.param('login'),
            email: req.param('email')
        }

        let paramsSearch = {};

        if (data.id != "") { paramsSearch.id = data.id }
        if (data.login != "") { paramsSearch.login = { contains: data.login } }
        if (data.email != "") { paramsSearch.email = { contains: data.email } }

        User.find(paramsSearch).exec(function (err, users) {
            if (err) {
                return res.serverError(err);
            }

            return res.json(users);
        })
    },
    /**
     * Обновление данных о пользователе
     */
    update: function (req, res) {
        let id = req.param('id');
        let setData = {
            login: req.param('login'),
            email: req.param('email'),
            is_admin: req.param('is_admin') ? 1 : 0
        };

        // если что то пусто
        if (!setData.login || !setData.email) {
            // то говорим что запрос неверный
            return res.badRequest('Все поля должны быть заполнены!!');
        }

        User.query(
            'UPDATE user SET login = ?, email = ?, is_admin = ? WHERE id = ?;',
            [setData.login, setData.email, setData.is_admin, id],
            function (err, updateRes) {
                if (err) { return res.serverError(err); }

                res.json(updateRes);
            }
        );

    },
    /**
     * Смена пароля
     */
    changePassword: async function (req, res) {
        let id_req = req.param('id');
        let id = req.session.curUser.id;

        if (id_req != id) {
            return res.badRequest('Не ваша сессия!!');
        }

        let user = await User.findOne({ id: id });
        if (!user) {
            return res.notFound('Пользователя с таким id несуществует!!');
        }

        let password = {
            curPassword: req.param('curPassword'),
            newPassword: req.param('newPassword'),
            confirmationPassword: req.param('confirmationPassword'),
        }
        if (password.curPassword == password.newPassword) {
            return res.badRequest('Новый пароль совпадает с текущим!!');
        }
        if (password.newPassword != password.confirmationPassword) {
            return res.badRequest('Подтверждение нового пароля неверно!!');
        }

        BCryptService.compare(password.curPassword, user.password, function (err, resCompare) {
            if (err) {
                return res.serverError(err);
            } if (!resCompare) {
                return res.badRequest('Текущий пароль был введен не верно!!');
            } if (resCompare) {
                BCryptService.hash(password.newPassword, function (err, enPas) {
                    console.log(enPas);
                    User.update(
                        { id: user.id },
                        { password: enPas })
                        .then(function (updated) {
                            return res.ok();
                        })
                        .catch(function (err) {
                            sails.log.error(err);
                            return res.serverError();
                        });
                })
            };
        });
    }
};
