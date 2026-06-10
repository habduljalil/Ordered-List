const validator = require("../validator");
const ResponseDto = require("../../../utils/response.dto");
const service = require("../services/index.service");
const handleError = require("../../../utils/handleError");

async function addItemToList(req, res) {
    try {
        const listId = validator.validateListId(req.params);
        const item = validator.validateAddItem(req.body);

        const result = await service.addItemToList(listId, item);

        return res.status(201).json(ResponseDto.success("Item created successfully", result));
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = {
    addItemToList
};