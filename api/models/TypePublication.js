/**
 * TypePublication.js
 *
 */

module.exports = {

    connection: 'someMysqlServer',
    attributes: {
        type: {
            type: 'string',
            unique: true,
            required: true
        },
        publications: {
            collection: 'publication',
            via: 'type'
        }
    }
};

