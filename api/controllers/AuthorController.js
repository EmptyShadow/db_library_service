/**
 * AuthorController
 *
 * @description :: Server-side logic for managing Authors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var nestedPop = require('nested-pop');

module.exports = {
    /**
     * Поиск авторов по критериям: id, ФИО + язык (ru, en, ...)
     */
    find: async function (req, res) {
        // получение данных
        let data = {
            id: req.param('id'),
            name: req.param('name')
        };

        // валидация данных
        this.validateReqData(data, async function (err, data) {
            // если ошибок при валидации нет
            if (err === '') {
                // определяю параметры поиска имен
                let paramName = {};
                if (data.name.firstname) { paramName.firstname = { startsWith: data.name.firstname }; }
                if (data.name.patronymic) { paramName.patronymic = { startsWith: data.name.patronymic }; }
                if (data.name.lastname) { paramName.lastname = { startsWith: data.name.lastname }; }
                if (data.name.lang) {
                    paramName.lang = data.name.lang;
                }
                // ищу имена
                let names = await Name.find({
                    where: paramName,
                    select: ['author']
                });

                // формирую массив уникальных идентификаторов авторов
                let idsAuthors = [];
                names.forEach(name => {
                    if (idsAuthors.indexOf(name.author) == -1) {
                        idsAuthors.push(name.author);
                    }
                });

                let paramsAuthor = {
                    where: {
                        id: idsAuthors
                    }
                };
                // если нужно искать автора по идентификатору
                if (data.id !== '') {
                    if (idsAuthors.indexOf(data.id) == -1) {
                        return res.notFound();
                    }
                    paramsAuthor.where.id = data.id;
                }

                // ищу авторов
                Author
                    .find(paramsAuthor)
                    .populate('names')
                    .populate('publications')
                    .then(function (authors) {
                        // ищу для каждой публикации заголовки
                        authors = authors.map((s) => s.toJSON());
                        return nestedPop(authors, {
                            // массив полей, которые требуется найти
                            publications: ['titles']
                        }).then(function (authors) {
                            return res.json(authors);
                        }).catch(function (err) {
                            return res.serverError(err);
                        });
                    })
                    .catch(function (err) {
                        return res.serverError(err);
                    });
            } else {
                res.badRequest(err);
            }
        });
    },

    /**
     * Валидация данных для поиска
     * data - данные полученные из запроса
     * next - функция куда вернется результат
     */
    validateReqData: function (data, next) {
        if (data.id === undefined) { data.id = ''; }
        if (data.name === undefined) {
            data.name = {
                lang: '',
                firstname: '',
                patronymic: '',
                lastname: ''
            };
        } else if (data.name.lang === undefined) {
            data.name.lang = '';
        } else if (data.name.firstname === undefined) {
            data.name.firstname = '';
        } else if (data.name.patronymic === undefined) {
            data.name.patronymic = '';
        } else if (data.name.lastname === undefined) {
            data.name.lastname = '';
        }

        next('', data);
    },

    /**
     * Удалить автора, вмести с ним удаляется список его псевдонимов и исключаются авторства из публикаций
     */
    remove: function (req, res) {
        let params = req.allParams();

        Name.destroy({ author: params.id }).exec(function (err) {
            if (err) {
                return res.serverError(err);
            }

            Author.destroy({ id: params.id }).exec(function (err) {
                if (err) {
                    return res.serverError(err);
                }

                return res.ok();
            });
        });
    },
    /**
     * Удалить у автора псевдоним
     */
    removeName: function (req, res) {
        let params = req.allParams();
        Name.destroy({ id: params.idName }).exec(function (err) {
            if (err) {
                return res.serverError(err);
            }

            return res.ok();
        })
    },
    /**
     * Исключить автора из авторства на публикацию
     */
    removePublication: function (req, res) {
        let params = req.allParams();
        Author.findOne({ id: params.idAuthor }).populate('publications').exec(function (err, author) {
            if (err) { return res.serverError(err); }
            if (!author) { return res.notFound('Could not find a author id=' + params.idAuthor + '.'); }

            author.publications.remove(params.idPublication);
            author.save(function (err) {
                if (err) { return res.serverError(err); }
                return res.ok();
            });
        });
    }
};

