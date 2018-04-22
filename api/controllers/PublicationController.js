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
            editors: [],
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
            // находятся подходящие авторы
            let authors = await Author.find()
                .populate('names', paramsFind.authors)
                .populate('publications');
            authors.forEach((author, index, array) => {
                if (author.names.length == 0) { return; }

                if (paramsFind.authors.or != undefined) {
                    let idPublicationsAuthor = [];
                    author.publications.forEach(publication => {
                        if (idPublicationsAuthor.indexOf(publication.id) == -1) {
                            idPublicationsAuthor.push(publication.id);
                        }
                    });

                    if (index == 0) {
                        arrayIdPublications.authors = idPublicationsAuthor;
                    } else {
                        arrayIdPublications.authors = intersect(arrayIdPublications.authors, idPublicationsAuthor);
                    }
                } else {
                    author.publications.forEach(publication => {
                        if (arrayIdPublications.authors.indexOf(publication.id) == -1) {
                            arrayIdPublications.authors.push(publication.id);
                        }
                    });
                }
            });

            if (arrayIdPublications.publications.length != undefined) {
                arrayIdPublications.publications = intersect(arrayIdPublications.publications, arrayIdPublications.authors);
            } else {
                arrayIdPublications.publications = arrayIdPublications.authors;
            }
        }

        if (paramsFind.editor.name != undefined) {
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
        }

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
            editor: {}
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

        // поиск года публикации
        if (data.datepub != undefined && data.datepub != null) {
            paramsFind.publication.datepub = data.datepub;
        }

        // поиск по наличию нахождения в журналах, рейтингах и так далее
        if (data.is_vak != undefined) { paramsFind.publication.is_vak = data.is_vak; }
        if (data.is_rince != undefined) { paramsFind.publication.is_rince = data.is_rince; }
        if (data.is_wos != undefined) { paramsFind.publication.is_wos = data.is_wos; }
        if (data.is_scope != undefined) { paramsFind.publication.is_scope = data.is_scope; }
        if (data.is_doi != undefined) { paramsFind.publication.is_doi = data.is_doi; }

        // поиск по одной строковой фразе в издании
        if (data.editor != undefined && data.editor != '') {
            paramsFind.editor.name = { contains: data.editor };
        }

        data.authors.forEach(author => {
            paramsFind.authors.or.push({
                lastname: { startsWith: author.lastname != undefined ? author.lastname : '' },
                firstname: { startsWith: author.firstname != undefined ? author.firstname : '' },
                patronymic: { startsWith: author.patronymic != undefined ? author.patronymic : '' }
            });
        });

        return paramsFind;
    },
};

