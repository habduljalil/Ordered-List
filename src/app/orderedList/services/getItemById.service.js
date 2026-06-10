const repository = require("../repository");
const ApiError = require("../../../utils/errorFormat");

async function getItemById(id) {
    const item = await repository.getItemById(id);
  
    if (!item) {
        throw new ApiError("Item not found", 404);
    }
    return item;
}

module.exports = {
    getItemById
};