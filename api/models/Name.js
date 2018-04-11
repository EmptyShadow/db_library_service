/**
 * Name.js
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
    firstname: {
      type: 'string',
      require: true,
      size: 40
    },
    patronymic: {
      type: 'string',
      size: 40
    },
    lastname: {
      type: 'string',
      require: true,
      size: 60
    },
    author: {
      model: 'author'
    }
  }
};

