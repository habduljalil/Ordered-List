const repository = require("../repository");

async function createList(name) {
    return repository.createList(name);
}

module.exports = {
    createList
};