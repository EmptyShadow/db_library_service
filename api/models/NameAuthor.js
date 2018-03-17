/**
 * NameAuthor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'someMysqlServer',
  attributes: {
    lang: {
      type: 'string',
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
    }
  }
};

