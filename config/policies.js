/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
  // RabbitController: {

  // Apply the `false` policy as the default for all of RabbitController's actions
  // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
  // '*': false,

  // For the action `nurture`, apply the 'isRabbitMother' policy
  // (this overrides `false` above)
  // nurture	: 'isRabbitMother',

  // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
  // before letting any users feed our rabbits
  // feed : ['isNiceToAnimals', 'hasRabbitFood']
  // }
  UserController: {
    search: ['sessionAuth', 'isAdmin'],
    update: ['sessionAuth', 'isAdmin'],
    changePassword: ['sessionAuth']
  },
  AuthorController: {
    remove: ['sessionAuth', 'isAdmin'],
    removeName: ['sessionAuth', 'isAdmin'],
    removePublication: ['sessionAuth', 'isAdmin'],
    create: ['sessionAuth', 'isAdmin'],
    addName: ['sessionAuth', 'isAdmin'],
    updateName: ['sessionAuth', 'isAdmin']
  },
  EditionController: {
    remove: ['sessionAuth', 'isAdmin'],
    removeTitle: ['sessionAuth', 'isAdmin'],
    create: ['sessionAuth', 'isAdmin'],
    addTitle: ['sessionAuth', 'isAdmin'],
    updateTitle: ['sessionAuth', 'isAdmin']
  },
  PublicationController: {
    remove: ['sessionAuth', 'isAdmin'],
    create: ['sessionAuth', 'isAdmin'],
    update: ['sessionAuth', 'isAdmin'],
    createTitle: ['sessionAuth', 'isAdmin'],
    updateTitle: ['sessionAuth', 'isAdmin'],
    removeTitle: ['sessionAuth', 'isAdmin'],
    addAuthor: ['sessionAuth', 'isAdmin'],
    removeAuthor: ['sessionAuth', 'isAdmin'],
    replaceEditor: ['sessionAuth', 'isAdmin'],
    removeEditor: ['sessionAuth', 'isAdmin']
  },
  DefAddedController: {
    typesPublication: ['sessionAuth', 'isAdmin'],
    authors: ['sessionAuth', 'isAdmin'],
    publications: ['sessionAuth', 'isAdmin'],
    all: ['sessionAuth', 'isAdmin']
  }

};
