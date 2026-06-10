const validator = require("../validator");
const ResponseDto = require("../../../utils/response.dto");
const service = require("../services/index.service");
const handleError = require("../../../utils/handleError");

async function getItemsByList(req, res) {
    try {
        const listId = validator.validateListId(req.params);
        const result = await service.getItemsByList(listId);

        return res.status(200).json(ResponseDto.success("Items fetched successfully", result));
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = {
    getItemsByList
};