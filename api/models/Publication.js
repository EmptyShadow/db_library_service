/**
 * Publication.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'someMysqlServer',
  attributes: {
    type: {
      model: 'typepublication'
    },
    titles: {
      collection: 'publicationtitle',
      via: 'publication'
    },
    datepub: {
      type: 'integer',
      required: true
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
    wos: {
      type: 'string'
    },
    // публикация в журнале
    scopus_id: {
      type: 'string'
    },
    doi: {
      type: 'string'
    },
    link: {
      type: 'string'
    },
    dataout: {
      type: 'string'
    },
    authors: {
      collection: 'author',
      via: 'publications'
    },
    isbn: {
      type: 'string'
    },
    editor: {
      model: 'editor'
    }
  }
};

