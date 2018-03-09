/**
 * TitleEditor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'someMysqlServer',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    lang: {
      type: 'string',
      require: true
    },
    title: {
      type: 'string',
      unique: true,
      required: true
    }
  }
};

