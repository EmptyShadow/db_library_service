/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  // Если пользователь вошел на сайт
  if (req.session.logged_in) {
    // Если пользователь во время ипользования сменил ip
    if (req.ip != req.session.ip) {
      // то разлогиним его
      req.session.logged_in = false;
      return res.view('homepage');
    }
    return next();
  }

  // Перебрасываем на домашнюю страницу
  return res.view('homepage');
};
