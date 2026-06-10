const repository = require("../repository");
const ApiError = require("../../../utils/errorFormat");

async function getItemsByList(listId) {
    const list = await repository.getListById(listId);

    if (!list) {
        throw new ApiError("List not found", 404);
    }
    return repository.getItemsByList(listId);
}

module.exports = {
    getItemsByList
};