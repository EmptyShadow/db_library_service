/**
 * 
 * @param {Значение, которое надо зашифровать} data 
 * @param {Функция продолжения} next 
 */
let bcrypt = require('bcrypt');

exports.hash = function (data, next) {
    bcrypt.hash(data, 10, next)
}

exports.compare = function (data, encryptedData, next) {
    bcrypt.compare(data, encryptedData, next);
}