/**
 * Publication.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'someMysqlServer',
  attributes: {
    titles: {
      collection: 'publicationtitle',
      via: 'publication'
    },
    datepub: {
      type: 'integer',
      require: true
    },
    //Высшая Аттестационная Комиссия
    is_vak: {
      type: 'boolean',
      defaultTo: false
    },
    // РОССИЙСКИЙ ИНДЕКС НАУЧНОГО ЦИТИРОВАНИЯ
    is_rince: {
      type: 'boolean',
      defaultTo: false
    },
    // хз
    is_wos: {
      type: 'boolean',
      defaultTo: false
    },
    // публикация в журнале
    is_scopus: {
      type: 'boolean',
      defaultTo: false
    },
    is_doi: {
      type: 'boolean',
      defaultTo: false
    },
    link: {
      type: 'string',
      require: true
    },
    authors: {
      collection: 'author',
      via: 'publications'
    },
    editor: {
      model: 'editor'
    }
  }
};

