const ResponseDto = require("../../../utils/response.dto");
const validator = require("../validator");
const service = require("../services/index.service");
const handleError = require("../../../utils/handleError");

async function createList(req, res) {
    try {
        validator.validateCreateList(req.body);
        
        const result = await service.createList(req.body.name.trim());
         
        return res.status(201).json(
            ResponseDto.success("List created successfully", result)
        );

    } catch (error) {
       return handleError(res, error);
    }
}

module.exports = {
    createList
};