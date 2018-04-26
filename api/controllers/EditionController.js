/**
 * EditionController
 *
 * @description :: Server-side logic for managing Editions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
     * Поиск изданий по критериям: id, название + язык (ru, en, ...)
     */
    find: async function (req, res) {
        // получение данных
        let data = {
            id: req.param('id'),
            title: req.param('title')
        };

        // валидация данных
        this.validateReqData(data, async function (err, data) {
            // если ошибок при валидации нет
            if (err === '') {
                // определяю параметры поиска названий
                let paramTitle = {};
                if (data.title.name) { paramTitle.name = { contains: data.title.name }; }
                if (data.title.lang) {
                    paramTitle.lang = data.title.lang;
                }
                // ищу названий
                let titles = await EditorName.find({
                    where: paramTitle,
                    select: ['editor']
                });

                // формирую массив уникальных идентификаторов изданий
                let idsEditions = [];
                titles.forEach(title => {
                    if (idsEditions.indexOf(title.editor) == -1) {
                        idsEditions.push(title.editor);
                    }
                });

                let paramsEditor = {
                    where: {
                        id: idsEditions
                    }
                };
                // если нужно искать издание по идентификатору
                if (data.id !== '') {
                    if (idsEditions.indexOf(data.id) == -1) {
                        return res.notFound();
                    }
                    paramsEditor.where.id = data.id;
                }

                // ищу издания
                Editor
                    .find(paramsEditor)
                    .populate('titles')
                    .then(function (editions) {
                        return res.json(editions);
                    })
                    .catch(function (err) {
                        return res.serverError(err);
                    });
            } else {
                res.badRequest(err);
            }
        });
    },

    findOneById: async function (req, res) {
        let id = req.param('id');

        try {
            let editor = await Editor.findOne({ id: id })
                .populate('titles');

            return res.json(editor);
        } catch (err) {
            return ErrorHandler.handle(err, res);
        }
    },

    findOne: async function (req, res) {
        let name = req.param('name');

        try {
            let editor = await findOne()
                .populate('titles', { where: { name: name } });

            if (!editor) {
                return res.notFound();
            }

            return res.json(editor);
        } catch (err) {
            if (err.name === 'UsageError') {
                return res.badRequest();
            } else {
                return res.serverError(err);
            }
        }
    },

    /**
     * Валидация данных для поиска
     * data - данные полученные из запроса
     * next - функция куда вернется результат
     */
    validateReqData: function (data, next) {
        if (data.id === undefined) { data.id = ''; }
        if (data.title === undefined) {
            data.title = {
                lang: '',
                name: ''
            };
        } else if (data.title.lang === undefined) {
            data.title.lang = '';
        } else if (data.title.name === undefined) {
            data.title.firstname = '';
        }

        next('', data);
    },
    /**
     * Удалить издание
     */
    remove: function (req, res) {
        let params = req.allParams();

        EditorName.destroy({ editor: params.id }).exec(function (err) {
            if (err) {
                return res.serverError(err);
            }

            Editor.destroy({ id: params.id }).exec(function (err) {
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
    removeTitle: function (req, res) {
        let params = req.allParams();
        EditorName.destroy({ id: params.idTitle }).exec(function (err) {
            if (err) {
                return res.serverError(err);
            }

            return res.ok();
        })
    },
    /**
     * Создать издание
     */
    create: async function (req, res) {
        let data = req.allParams();

        if (!data.lang || !data.name) {
            return res.badRequest('Не все данные об авторе заполненны!');
        }

        try {
            let editor = await Editor.create();

            let title = await EditorName.create(data);

            editor.titles.add(title.id);
            editor.save(async function (err) {
                if (err) {
                    return res.serverError('Произошла ошибка!');
                }
                editor = await Editor.findOne({ id: editor.id })
                    .populate('titles');

                return res.json(editor);
            });
        } catch (err) {
            return res.serverError('Произошла ошибка!');
        }
    },
    /**
     * Добавить заголовок изданию
     */
    addTitle: async function (req, res) {
        let data = req.allParams();

        let editor = await Editor.findOne({ id: data.id })
            .populate('titles');
        delete data.id;
        let title = await EditorName.create(data);

        editor.titles.add(title.id);
        editor.save(function (err) {
            if (err) {
                return res.serverError(err);
            }

            return res.json(title);
        })
    },
    /**
     * Обновить заголовок издания
     */
    updateTitle: async function (req, res) {
        let id = req.param('id');
        let data = req.allParams();
        delete data.id;

        if (!data.lang || !data.name) {
            return res.badRequest('Не все данные об авторе заполненны!');
        }

        try {
            let updated = await EditorName.update({ id: id }, data);

            return res.json(updated[0]);
        } catch (err) {
            return res.serverError('Произошла ошибка!');
        }
    }
};

