/**
 * ContactController
 *
 * @description :: Server-side logic for managing Contacts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getContacts: function (req, res) {
        return res.json([
            {
                title: 'VK',
                link: 'https://vk.com/'
            },
            {
                title: 'GitHub',
                link: 'https://github.com/eltech-anykeyers/db_library_service'
            }
        ]);
    }
};

