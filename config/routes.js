/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  /**
   * Пользователь
   */

  'POST /user/login': {
    controller: 'UserController',
    action: 'login'
  },

  'POST /user/logout': {
    controller: 'UserController',
    action: 'logout'
  },

  'POST /user/join': {
    controller: 'UserController',
    action: 'join'
  },

  'POST /users/search': {
    controller: 'UserController',
    action: 'search'
  },

  'POST /user/update': {
    controller: 'UserController',
    action: 'update'
  },

  'POST /user/:id/change_password': {
    controller: 'UserController',
    action: 'changePassword'
  },

  /**
   * Авторы
   */

  'POST /authors/search': {
    controller: 'AuthorController',
    action: 'find'
  },

  'POST /author/create': {
    controller: 'AuthorController',
    action: 'create'
  },

  'POST /author/:id/add/name': {
    controller: 'AuthorController',
    action: 'addName'
  },

  'POST /author/name/update': {
    controller: 'AuthorController',
    action: 'updateName'
  },

  'DELETE /author/:id': {
    controller: 'AuthorController',
    action: 'remove'
  },

  'DELETE /author/:idAuthor/name/:idName': {
    controller: 'AuthorController',
    action: 'removeName'
  },

  'DELETE /author/:idAuthor/publication/:idPublication': {
    controller: 'AuthorController',
    action: 'removePublication'
  },

  /**
   * Издания
   */

  'POST /editions/search': {
    controller: 'EditionController',
    action: 'find'
  },

  'GET /editor/:id': {
    controller: 'EditionController',
    action: 'findOneById'
  },

  'GET /edition/search/:name': {
    controller: 'EditionController',
    action: 'findOne'
  },

  'POST /editor/create': {
    controller: 'EditionController',
    action: 'create'
  },

  'POST /editor/:id/add/title': {
    controller: 'EditionController',
    action: 'addTitle'
  },

  'POST /editor/title/update': {
    controller: 'EditionController',
    action: 'updateTitle'
  },

  'DELETE /editor/:id': {
    controller: 'EditionController',
    action: 'remove'
  },

  'DELETE /editor/:idEditor/title/:idTitle': {
    controller: 'EditionController',
    action: 'removeTitle'
  },

  /**
   * Публикации
   */

  'POST /publications/search': {
    controller: 'PublicationController',
    action: 'find'
  },

  'POST /publication/create': {
    controller: 'PublicationController',
    action: 'create'
  },

  'POST /publication/update': {
    controller: 'PublicationController',
    action: 'update'
  },

  'DELETE /publication/:id': {
    controller: 'PublicationController',
    action: 'remove'
  },

  'POST /publication/:id/title/create': {
    controller: 'PublicationController',
    action: 'createTitle'
  },

  'POST /publication/title/update': {
    controller: 'PublicationController',
    action: 'updateTitle'
  },

  'DELETE /publication/title/:id': {
    controller: 'PublicationController',
    action: 'removeTitle'
  },

  'GET /publication/:idPublication/author/:idAuthor': {
    controller: 'PublicationController',
    action: 'addAuthor'
  },

  'DELETE /publication/:idPublication/author/:idAuthor': {
    controller: 'PublicationController',
    action: 'removeAuthor'
  },

  'GET /publication/:idPublication/editor/:idEditor': {
    controller: 'PublicationController',
    action: 'replaceEditor'
  },

  'DELETE /publication/:idPublication/editor': {
    controller: 'PublicationController',
    action: 'removeEditor'
  },

  /**
   * Навигация
   */

  'GET /navs': {
    controller: 'NavbarController',
    action: 'getNavs'
  },

  /**
   * Мануал
   */

  'GET /manual': {
    controller: 'ManualController',
    action: 'getManual'
  },

  /**
   * Контакты разработчиков
   */

  'GET /contacts': {
    controller: 'ContactController',
    action: 'getContacts'
  },

  /**
   * Значения по умолчанию
   */
  'GET /def/types-publication': {
    controller: 'DefAddedController',
    action: 'typesPublication'
  },
  'GET /def/authors': {
    controller: 'DefAddedController',
    action: 'authors'
  },
  'GET /def/publications': {
    controller: 'DefAddedController',
    action: 'publications'
  },
  'GET /def/all': {
    controller: 'DefAddedController',
    action: 'all'
  },
  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't matc h any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
