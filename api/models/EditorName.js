/**
 * EditorName.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    connection: 'someMysqlServer',
    attributes: {
        lang: {
            type: 'string',
            required: true,
        },
        name: {
            type: 'string',
            required: true,
            unique: true,
            size: 40
        },
        editor: {
            model: 'editor'
        }
    }
};  