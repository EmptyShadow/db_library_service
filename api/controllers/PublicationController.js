/**
 * PublicationController
 *
 * @description :: Server-side logic for managing Publications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * Поиск публикаций по id, названиям публикаций, псевдонимам авторов, названиям издания и информации об публикации
     */
    find: async function (req, res) {
        let data = req.allParams();
        console.log(data);
    },
    /**
     * Получение параметров поиска из принятых данных
     */
    getParamsFind: function (data) {
        let paramsFind = {};

        if (data.id != undefined) {
            paramsFind.id = data.id;
        }

        // поиск по одной строковой фразе в заголовке
        if (data.titles !== undefined) {
            if ((typeof data.titles) == "string") {
                paramsFind.title = { contains: data.titles };
            }
        }
    }
};

