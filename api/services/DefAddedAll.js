exports.add = async function () {
    await DefAddedTypesPublication.add();
    await DefAddedAuthors.add();
    await DefAddedPublications.add();
    return;
}