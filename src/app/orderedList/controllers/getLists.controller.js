const service = require("../services/index.service");
const ResponseDto = require("../../../utils/response.dto");
const handleError = require("../../../utils/handleError");

async function getLists(req, res) {
    try {
        const result = await service.getLists();

        return res.status(200).json(
            ResponseDto.success("Lists fetched successfully", result)
        );

    } catch (error) {
       return handleError(res, error);
    }
}

module.exports = {
    getLists
};