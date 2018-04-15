/**
 * isAdmin
 *
 * @module      :: Policy
 * @description :: user is the admin?
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {

  // если сессия с пользователем существует
  if (req.session.curUser !== undefined) {
    // если пользователь администратор и ip он не менял
    if (req.session.curUser.is_admin && req.session.ip == req.ip) {
      // то он проходит дальше
      return next();
    }
  }

  // Перебрасываем на домашнюю страницу
  return res.badRequest({policyError: 'Вы не администратор!!'});
};
