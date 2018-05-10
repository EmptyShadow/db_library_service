let data = [
    ['Бутусов Денис Николаевич', 'Butusov Denis Nikolaevich'],
    ['Андреев Валерий Сергеевич', 'Andreev Valery Sergeevich'],
    ['Каримов Артур Искандарович', 'Karimov Artur Iskandarovich'],
    ['Каримов Тимур Искандарович', 'Karimov Timur Iskandarovich'],
    ['Красильников Александр Витальевич', 'Krasilnikov Alexander Vitalievich'],
    ['Островский Валерий Юрьевич', 'Ostrovskii Valery Yurievich'],
    ['Тутуева Александра Вадимовна', 'Tutueva Alexandra Vadimovna'],
    ['Горяинов Сергей Вадимович', 'Goryainov Sergey Vadimovich'],
    ['Рыбин Вячеслав Геннадьевич', 'Rybin Vyacheslav Gennadievich'],
    ['Копец Екатерина Евгеньевна​', 'Kopets Ekaterina Evgenievna'],
];

/**
 * Получение массива имен
 * @param {строка имен 'Фамилия Имя [Отчество]'} strNames 
 */
let getArrNames = function (strNames) {
    return strNames.split(' ');
}

/**
 * Поиск id автора по его строке имен
 * @param {массив имен ['Фамилия', 'Имя', ['Отчество']]} names 
 */
let findAuthorIdByStrNames = async function (names) {
    // определяю параметры поиска имени автора
    let params = {
        lastname: names[0],
        firstname: names[1]
    }
    if (names[2] != undefined) {
        params.patronymic = names[2]
    }

    // ищу имя автора
    let name = await Name.findOne(params);

    return name != undefined ? name.author : null;
};

/**
 * Создать объект имени
 * @param {Национальность имен} lang 
 * @param {Имена ['Фамилия', 'Имя', ['Отчество']]} names 
 */
let createObjNameAuthor = function (lang, names) {
    let name = {
        lang: lang,
        lastname: names[0],
        firstname: names[1]
    };
    if (names[2] != undefined) {
        name. patronymic = names[2];
    }
    
    return name;
};

exports.add = async function () {
    console.log('Added default authors');
    // авторы, которых нужно создать
    let newAuthors = [];
    // имена, которе нужно добавить к авторам
    let addedNames = [];

    for (let i = 0; i < data.length; i++) {
        let ru = getArrNames(data[i][0]);
        let en = getArrNames(data[i][1]);

        let indexRu = await findAuthorIdByStrNames(ru);
        let indexEn = await findAuthorIdByStrNames(en);

        // если по обоим псевдонимам ничего не было найдено
        if (indexRu == null && indexEn == null) {
            // добавляем в массив нового автора
            newAuthors.push({
                names: [
                    createObjNameAuthor('ru', ru),
                    createObjNameAuthor('en', en)
                ]
            })
            console.log('new author:');
            console.log('ru');
            console.log(ru);
            console.log('en');
            console.log(en);
        // если что то найдено, то добавляем в массив имен, то что требуется добавить
        } else if (indexRu != null) {
            let name = createObjNameAuthor('en', en);
            en.author = indexRu;
        } else {
            let name = createObjNameAuthor('ru', ru);
            en.author = indexEn;
        }
    }

    await Author.createEach(newAuthors);
    await Name.createEach(addedNames);
    console.log('end');
    console.log();
    return;
}