/**
 * EditorName.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'someMysqlServer',
    attributes: {
        lang: {
            type: 'string',
            isIn: [/* Английский */'en',
          /* Американский английский */'en-us',
          /* Немецкий */'de',
          /* Русский */	'ru',
          /* Украинский */'uk',
          /* Французский */'fr',
          /* Чешский */'cs',
          /* Шведский */'sv',
          /* Эсперанто (искусственный язык) */'eo'],
            require: true
        },
        name: {
            type: 'string',
            require: true,
            size: 40
        },
        editor: {
            model: 'editor'
        }
    }
};  