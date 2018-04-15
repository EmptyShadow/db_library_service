/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.logged_in = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {
  console.log('sessionAuth ' + req.ip);
  console.log(req.session);

  // Если пользователь вошел на сайт
  if (req.session.logged_in) {
    // Если пользователь во время ипользования сменил ip
    if (req.ip != req.session.ip) {
      // то разлогиним его
      req.session.logged_in = false;
      return res.badRequest({policyError: 'Не совпадение IP адресов сессий!!'});
    }
    return next();
  }

  // Перебрасываем на домашнюю страницу
  return res.badRequest({policyError: 'Вы не авторизованнный пользователь!!'});
};
