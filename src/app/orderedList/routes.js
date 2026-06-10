const express = require("express");
const controller = require("./controllers/index.controller");

const router = express.Router();

// Lists
router.post("/lists", controller.createList);
router.get("/lists", controller.getLists);

// Items inside a list
router.post("/lists/:id/items", controller.addItemToList);
router.get("/lists/:id/items", controller.getItemsByList);

// Single item
router.get("/items/:id", controller.getItemById);
router.patch("/items/:id/position", controller.moveItemPosition);
router.delete("/items/:id", controller.deleteItem);

module.exports = router; 