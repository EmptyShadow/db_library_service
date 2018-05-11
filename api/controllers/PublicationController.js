/**
 * PublicationController
 *
 * @description :: Server-side logic for managing Publications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var nestedPop = require('nested-pop');

module.exports = {
    /**
     * Поиск публикаций по id, названиям публикаций, псевдонимам авторов, названиям издания и информации об публикации
     */
    find: async function (req, res) {
        let data = req.allParams();
        let paramsFind = this.getParamsFind(data);

        // функция пересечения двух множеств
        let intersect = function (array1, array2) {
            let result = array1.filter(function (n) {
                return array2.indexOf(n) !== -1;
            });

            return result;
        }

        let intersects = function (arraySets) {
            let result = [];
            for (let i = 0; i < arraySets.length - 1; i++) {
                result = intersect(arraySets[i], arraySets[i + 1]);
            }
            return result;
        }

        // формируется массив уникальных id публикаций
        let arrayIdPublications = {
            titles: [],
            authors: [],
            /* editors: [], */
            publications: {}
        };

        // Если в поиске заданны параметры названия, то учитываем найденные названия
        if (paramsFind.titles.title != undefined) {
            // находятся подходящие названия публикаций
            let titles = await PublicationTitle.find(paramsFind.titles);
            titles.forEach(title => {
                if (arrayIdPublications.titles.indexOf(title.publication) == -1) {
                    arrayIdPublications.titles.push(title.publication);
                }
            });
            arrayIdPublications.publications = arrayIdPublications.titles;
        }

        // Если в поиске заданны параметры авторов, то учитываем авторов
        if (paramsFind.authors.or != undefined) {
            arrayIdPublications.authors = [];
            let flagInitArray = false;
            // находятся подходящие авторы
            let authors = await Author.find()
                .populate('names', paramsFind.authors)
                .populate('publications');

            authors.forEach((author) => {
                if (author.names.length == 0) { return; }

                let idPublicationsAuthor = [];
                author.publications.forEach(publication => {
                    if (idPublicationsAuthor.indexOf(publication.id) == -1) {
                        idPublicationsAuthor.push(publication.id);
                    }
                });

                if (!flagInitArray) {
                    arrayIdPublications.authors = idPublicationsAuthor;
                    flagInitArray = true;
                } else {
                    arrayIdPublications.authors = intersect(arrayIdPublications.authors, idPublicationsAuthor);
                }
            });

            if (arrayIdPublications.publications.length != undefined) {
                arrayIdPublications.publications = intersect(arrayIdPublications.publications, arrayIdPublications.authors);
            } else {
                arrayIdPublications.publications = arrayIdPublications.authors;
            }
        }

        /* if (paramsFind.editor.name != undefined) {
            // находятся подходящие издания
            let editors = await Editor.find()
                .populate('titles', paramsFind.editor)
                .populate('publications');
            editors.forEach(editor => {
                if (editor.titles.length == 0) { return; }
                editor.publications.forEach(publication => {
                    if (arrayIdPublications.editors.indexOf(publication.id) == -1) {
                        arrayIdPublications.editors.push(publication.id);
                    }
                });
            });

            if (arrayIdPublications.publications.length != undefined) {
                arrayIdPublications.publications = intersect(arrayIdPublications.publications, arrayIdPublications.editors);
            } else {
                arrayIdPublications.publications = arrayIdPublications.editors;
            }
        } */

        if (paramsFind.publication.id != undefined) {
            if (arrayIdPublications.publications.length != undefined) {
                if (arrayIdPublications.publications.indexOf(paramsFind.publication.id) == -1) {
                    return res.notFound();
                }
            }
        } else {
            if (arrayIdPublications.publications.length != undefined) {
                paramsFind.publication.id = arrayIdPublications.publications;
            }
        }

        let publications = await Publication.find(paramsFind.publication)
            .populate('type')
            .populate('titles')
            .populate('authors')
            .populate('editor');

        publications = publications.map((s) => s.toJSON());
        nestedPop(publications, {
            // массив полей, которые требуется найти
            authors: ['names'],
            editor: ['titles']
        }).then(function (publications) {
            return res.json(publications);
        }).catch(function (err) {
            return res.serverError(err);
        });
    },
    /**
     * Получение параметров поиска из принятых данных
     */
    getParamsFind: function (data) {
        let paramsFind = {
            publication: {},
            titles: {},
            authors: data.authors.length != 0 ? { or: [] } : {},
            /* editor: {} */
        };

        if (data.id != undefined && data.id != null) {
            paramsFind.publication.id = data.id;
        }

        // поиск по одной строковой фразе в заголовке
        if (data.titles !== undefined && data.titles != '') {
            if ((typeof data.titles) == "string") {
                paramsFind.titles.title = { contains: data.titles };
            }
        }

        // поиск по стране публикации
        if (data.country != '') {
            paramsFind.publication.country = data.country;
        }

        // поиск года публикации
        if (data.datepub != undefined && data.datepub != null) {
            let indexDef = data.datepub.indexOf('-');
            if (indexDef == -1) {
                paramsFind.publication.datepub = data.datepub;
            } else {
                paramsFind.publication.datepub = {
                    '>=': data.datepub.substring(0, indexDef),
                    '<=': data.datepub.substring(indexDef + 1)
                };
            }
        }

        // поиск по наличию нахождения в журналах, рейтингах и так далее
        if (data.is_vak != undefined) { paramsFind.publication.is_vak = data.is_vak; }
        if (data.is_rince != undefined) { paramsFind.publication.is_rince = data.is_rince; }
        if (data.wos) { paramsFind.publication.wos = data.wos; }
        if (data.scopus_id) { paramsFind.publication.scopus_id = data.scopus_id; }
        if (data.doi) { paramsFind.publication.doi = data.doi; }
        if (data.type) { paramsFind.publication.type = data.type; }

        /* // поиск по одной строковой фразе в издании
        if (data.editor != undefined && data.editor != '') {
            paramsFind.editor.name = { contains: data.editor };
        } */

        data.authors.forEach(author => {
            let or = {};
            if (author.lastname != undefined) {
                or.lastname = {
                    startsWith: author.lastname
                }
            }
            if (author.firstname != undefined) {
                or.firstname = {
                    startsWith: author.firstname
                }
            }
            if (author.patronymic != undefined) {
                or.patronymic = {
                    startsWith: author.patronymic
                }
            }
            if (or.lastname || or.firstname || or.patronymic) {
                paramsFind.authors.or.push(or);
            }
        });

        return paramsFind;
    },
    /**
     * Создать новую публикацию
     */
    create: async function (req, res) {
        let data = req.allParams();
        let title = req.param('title');
        title.lang = GetLang.getLangByStr(title.title);
        delete data.title;
        delete data.titles;
        delete data.authors;

        try {
            let publication = await Publication.create(data);
            title = await PublicationTitle.create(title);

            publication.titles.add(title.id);
            publication.save(async function (err) {
                title.publication = publication.id;
                if (err) {
                    return res.serverError(err);
                }

                publication = await Publication.findOne({ id: publication.id })
                    .populate('type')
                    .populate('titles')
                    .populate('authors')
                    .populate('editor');
                return res.json(publication);
            });
        } catch (err) {
            return ErrorHandler.handle(err, res);
        }
    },
    /**
     * Обновить публикацию
     */
    update: async function (req, res) {
        let id = req.param('id');
        let data = req.allParams();
        delete data.id;
        delete data.titles;
        delete data.authors;
        delete data.publications;

        try {
            let publication = await Publication.update(id, data);
            res.ok();
        } catch (err) {
            return ErrorHandler.handle(err, res);
        }
    },
    /**
     * Удалить публикацию
     */
    remove: async function (req, res) {
        let id = req.param('id');

        try {
            let publication = await Publication.findOne({ id: id })
                .populate('type')
                .populate('titles')
                .populate('authors')
                .populate('editor');

            let idTitles = [];
            publication.titles.forEach(element => {
                publication.titles.remove(element.id);
                idTitles.push(element.id);
            });

            let paramDestroy = {};
            if (idTitles.length > 0) {
                paramDestroy.id = idTitles;
            }
            await PublicationTitle.destroy(paramDestroy);

            publication.authors.forEach(element => {
                publication.authors.remove(element.id);
            });

            publication.save(async function (err) {
                if (err) {
                    return res.serverError(err);
                }

                await Publication.destroy({ id: publication.id });

                return res.ok();
            });
        } catch (err) {
            return ErrorHandler.handle(err, res);
        }
    },

    /**
     * Создать заголовок публикации
     */
    createTitle: async function (req, res) {
        let id = req.param('id');
        let data = req.allParams();
        delete data.id;

        try {
            let publication = await Publication.findOne({ id: id })
                .populate('titles');
            let title = await PublicationTitle.create(data);

            publication.titles.add(title.id);

            publication.save(function (err) {
                if (err) {
                    throw err;
                }

                return res.json(title);
            });
        } catch (err) {
            return ErrorHandler.handle(err, res);
        }
    },
    /**
     * Изменить заголовок публикации
     */
    updateTitle: async function (req, res) {
        let id = req.param('id');
        let data = req.allParams();
        delete data.id;

        try {
            let title = await PublicationTitle.update({ id: id }, data);

            return res.json(title[0]);
        } catch (err) {
            return ErrorHandler.handle(err, res);
        }
    },
    /**
     * Удалить заголовок у публикации
     */
    removeTitle: async function (req, res) {
        let id = req.param('id');

        try {
            await PublicationTitle.destroy({ id: id });

            return res.ok();
        } catch (err) {
            return ErrorHandler.handle(err, res);
        }
    },
    /**
     * Добавить автора к публикации
     */
    addAuthor: async function (req, res) {
        let idPublication = req.param('idPublication');
        let authorNameParams = req.allParams();
        delete authorNameParams.idPublication;

        try {
            let authorName = await Name.findOne(authorNameParams);

            if (authorName == undefined) {
                authorNameParams.lang = GetLang.getLangByStr(authorNameParams.lastname);

                let author = await Author.create({ names: [authorNameParams], publications: [idPublication] })
                    .populate('names');

                return res.json(await Author.findOne({ id: author.id }).populate('names'));
            }

            let author = await Author.findOne({ id: authorName.author })
                .populate('names');
            let publication = await Publication.findOne({ id: idPublication });

            publication.authors.add(authorName.author);
            publication.save(function (err) {
                if (err) {
                    throw err;
                }

                return res.json(author);
            })
        } catch (err) {
            return ErrorHandler.handle(err, res);
        }
    },
    /**
     * Исключить автора из списка авторов публикации
     */
    removeAuthor: async function (req, res) {
        let ids = req.allParams();

        try {
            let publication = await Publication.findOne({ id: ids.idPublication });
            let author = await Author.findOne({ id: ids.idAuthor });

            publication.authors.remove(author.id);
            publication.save(function (err) {
                if (err) {
                    throw err;
                }

                return res.ok();
            })
        } catch (err) {
            return ErrorHandler.handle(err, res);
        }
    },
    /**
     * Изменить издание публикации
     */
    replaceEditor: async function (req, res) {
        let idPublication = req.param('idPublication');
        let name = req.param('name');

        try {
            let editorName = await EditorName.findOne({ name: name });
            if (editorName == undefined) {
                let editor = await Editor.create({
                    titles: [{
                        lang: GetLang.getLangByStr(name),
                        name: name
                    }],
                    publications: [idPublication]
                });
                return res.json(await Editor.findOne({id: editor.id}).populate('titles'));
            }

            let editor = await Editor.findOne({ id: editorName.editor })
                .populate('titles');

            await Publication.update({ id: idPublication }, { editor: editor.id });

            return res.json(editor);
        } catch (err) {
            return ErrorHandler.handle(err, res);
        }
    },
    /**
     * Удалить издание из публикации
     */
    removeEditor: async function (req, res) {
        let ids = req.allParams();

        try {
            let publication = await Publication.update({ id: ids.idPublication }, { editor: null });

            return res.ok();
        } catch (err) {
            return ErrorHandler.handle(err, res);
        }
    },
};

