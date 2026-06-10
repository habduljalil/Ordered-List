const validator = require("../validator");
const ResponseDto = require("../../../utils/response.dto");
const service = require("../services/index.service");
const handleError = require("../../../utils/handleError");

async function getItemById(req, res) {
    try {
        const id = validator.validateItemId(req.params);
        const item = await service.getItemById(id);

        return res.status(200).json(
            ResponseDto.success("Item fetched successfully", item)
        );

    } catch (error) {
       return handleError(res, error);
    }
}

module.exports = {
    getItemById
};