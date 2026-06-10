const repository = require("../repository");
const ApiError = require("../../../utils/errorFormat");

async function addItemToList(listId, item) {
    const lists = await repository.getLists();
    const exists = lists.find(l => l.id === listId);
    if (!exists) {
        throw new ApiError("List not found", 404);
    }
    return repository.createItem(listId, item);
}

module.exports = {
    addItemToList
};