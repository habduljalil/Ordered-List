const repository = require("../repository");
const ApiError = require("../../../utils/errorFormat");

async function moveItemPosition(itemId, newPosition) {

    const item = await repository.getItemById(itemId);

    if (!item) {
        throw new ApiError("Item not found", 404);
    }
    
    const listId = item.listId;
    const oldPos = item.position;
    const { isSamePosition } = await repository.validatePosition(
        listId,
        newPosition,
        oldPos
    );

    if (isSamePosition) {
        return {
            id: itemId,
            listId,
            position: oldPos
        };
    }

    return repository.moveItemPosition(itemId, newPosition, listId, oldPos);
}

module.exports = {
    moveItemPosition
};