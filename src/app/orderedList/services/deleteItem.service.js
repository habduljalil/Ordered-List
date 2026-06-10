const repository = require("../repository");
const ApiError = require("../../../utils/errorFormat");

async function deleteItem(itemId) {
    const item = await repository.getItemById(itemId);

    if (!item) {
        throw new ApiError("Item not found", 404);
    }

    return repository.deleteItem(
        itemId,
        item.listId,
        item.position
    );
}

module.exports = {
    deleteItem
};