
let data = [
    'Статья в нерецензируемом журнале',
    'Cтатья в рецензируемом журнале',
    'Cтатья в сборнике конференций',
    'Диссертация',
    'Монография'
];

exports.add = async function () {
    console.log('Added default types publication');
    let types = [];
    for (let i = 0; i < data.length; i++) {
        let type = await TypePublication.findOne({ type: data[i] });
        if (type == undefined) {
            types.push({ type: data[i] });
            console.log('new type ' + data[i]);
        }
    }

    await TypePublication.createEach(types);
    console.log('end');
    console.log();
    return;
}