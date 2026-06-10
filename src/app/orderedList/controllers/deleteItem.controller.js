const validator = require("../validator");
const ResponseDto = require("../../../utils/response.dto");
const service = require("../services/index.service");
const handleError = require("../../../utils/handleError");

async function deleteItem(req, res) {
    try {
        const id = validator.validateDeleteItem(req.params);

        const result = await service.deleteItem(id);

        return res.status(200).json(
            ResponseDto.success("Item deleted successfully", result)
        );

    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = {
    deleteItem
};