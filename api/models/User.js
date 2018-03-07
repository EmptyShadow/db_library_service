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
      required: false
    },
    name: {
      //columnName: 'login',
      type: 'string',
      unique: true,
      required: false,
      size: 30
    },
    email: {
      //columnName: 'email',
      type: 'string',
      unique: true,
      required: false
    },
    password: {
      //columnName: 'password',
      type: 'string',
      required: false
    },
    is_admin: {
      //columnName: 'is_admin',
      type: 'boolean',
      defaultsTo: false
    }
  }
};

