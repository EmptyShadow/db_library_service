/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'someMysqlServer',
  attributes: {
    id: {
      //columnName: 'id',
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      required: true
    },
    login: {
      //columnName: 'login',
      type: 'string',
      unique: true,
      required: true,
      size: 30
    },
    email: {
      //columnName: 'email',
      type: 'string',
      unique: true,
      required: true
    },
    password: {
      //columnName: 'password',
      type: 'string',
      required: true
    },
    is_admin: {
      //columnName: 'is_admin',
      type: 'boolean',
      defaultsTo: false,
      required: true
    }
  }
};

