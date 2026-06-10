const validator = require("../validator");
const ResponseDto = require("../../../utils/response.dto");
const service = require("../services/index.service");
const handleError = require("../../../utils/handleError");

async function moveItemPosition(req, res) {
    try {
        const { id, position } = validator.validateMoveItem(
            req.body,
            req.params
        );

        const result = await service.moveItemPosition(id, position);

        return res.status(200).json(
            ResponseDto.success("Item moved successfully", result)
        );

    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = {
    moveItemPosition
};