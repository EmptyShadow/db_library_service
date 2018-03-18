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
                manual: 'Для использования поиска публикаций авторизация и регистрация на сайте не требуется. Для того, чтобы добавлять и изменять информацию, вам потребуется зарегистрироваться, получить права администратора у действующих администраторов и авторизоваться на сайте.'
            }
        );
    }
};

