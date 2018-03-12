/**
 * ManualController
 *
 * @description :: Server-side logic for managing Manuals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getManual: function (req, res) {
        return res.json(
            {
                title: 'Инструкция',
                manual: 'Это инструкция Это инструкция Это инструкция Это инструкция Это инструкция Это инструкция Это инструкция'
            }
        );
    }
};

