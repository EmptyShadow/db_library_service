/**
 * 
 * @param {Значение, которое надо зашифровать} data 
 * @param {Функция продолжения} next 
 */
exports.hash = function (data, next) {
    require('bcrypt').hash(data, 10, next)
}

exports.compare = function (data, encryptedData, next) {
    require('bcrypt').compare(data, encryptedData, next);
}