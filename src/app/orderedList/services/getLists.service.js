const repository = require("../repository");

async function getLists() {
    return repository.getLists();
}

module.exports = {
    getLists
};