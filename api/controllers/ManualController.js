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
                /* manual:  */
                paragraphs: [
                    "Для использования поиска публикаций, авторов и изданий авторизация и регистрация на сайте не требуется. "
                    + "Для того, чтобы добавлять и изменять информацию, вам потребуется зарегистрироваться, "
                    + "получить права администратора у действующих администраторов и авторизоваться на сайте.",

                    "Механизм поиска позволяет сузить круг искомой информации, так чтобы дать более точный результат. "
                    + "Все условия в форме выполняются одновременно."
                ]
            }
        );
    }
};

