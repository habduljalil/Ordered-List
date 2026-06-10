const express = require("express");
const orderedListRoutes = require("./app/orderedList/routes");
const logger = require("./utils/logger");
const createFallback = require("./utils/fallback");
const invalidJsonFormat = require("./utils/invalidJsonFormat");

const app = express();

app.use(express.json());

app.use(invalidJsonFormat);

app.use(logger);

app.use("/", orderedListRoutes);

app.use(createFallback(orderedListRoutes));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});