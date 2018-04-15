/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  connection: 'someMysqlServer',
  attributes: {
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
      defaultsTo: false
    }
  },

  beforeCreate: function (data, next) {
    if (!data.password || data.password != data.confirmation) {
      return next({ errorPassword: 'Не савподение паролей' });
    }
    /*require('bcrypt').hash(data.password, 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) {
        return next(err);
      }
      data.password = encryptedPassword;
      next();
    })*/
    BCryptService.hash(data.password, function (err, encryptedPassword) {
      if (err) {
        sails.log.error(err);
        return;
      }
      data.password = encryptedPassword;
      next();
    })
  }
};

