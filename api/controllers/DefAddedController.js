/**
 * DefAddedController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    /**
     * Добавление значений по умолчанию для типов публикаций
     */
    typesPublication: async function (req, res) {
        await DefAddedTypesPublication.add();
        res.ok();
    },
    /**
     * Добавление значений по умолчанию для авторов
     */
    authors: async function (req, res) {
        await DefAddedAuthors.add();
        res.ok();
    },
    /**
     * Добавление значений по умолчанию для Публикаций
     */
    publications: async function (req, res) {
        await DefAddedPublications.add();
        res.ok();
    },
    /**
     * Добавление всех данных по умолчанию
     */
    all: async function (req, res) {
        await DefAddedAll.add();
        res.ok();
    }
};
