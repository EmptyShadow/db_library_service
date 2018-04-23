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
      required: true
    },
    firstname: {
      type: 'string',
      required: true,
      size: 40
    },
    patronymic: {
      type: 'string',
      size: 40
    },
    lastname: {
      type: 'string',
      required: true,
      size: 60
    },
    author: {
      model: 'author'
    }
  }
};

