module.exports = {
    getLists: require("./getLists.controller").getLists,
    getItemsByList: require("./getItemsByList.controller").getItemsByList,
    createList: require("./createList.controller").createList,
    addItemToList: require("./addItemToList.controller").addItemToList,
    getItemById: require("./getItemById.controller").getItemById,
    moveItemPosition: require("./moveItemPosition.controller").moveItemPosition,
    deleteItem: require("./deleteItem.controller").deleteItem
}