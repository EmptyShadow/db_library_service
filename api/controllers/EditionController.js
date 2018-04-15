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
    }
};

