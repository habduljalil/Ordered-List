const ApiError = require("../../utils/errorFormat");

function validateCreateList(body) {
    if (!body) {
        throw new ApiError("Request body is required", 400);
    }
    if (!body.name) {
        throw new ApiError("Name is required", 400);
    }
    if (typeof body.name !== "string") {
        throw new ApiError("Name must be a string", 400);
    }

    if (body.name.trim().length === 0) {
        throw new ApiError("Name cannot be empty", 400);
    }

	if (body.name.length > 50) {
		throw new ApiError("Name cannot exceed 50 characters", 400);
	}
}

function validateAddItem(body) {
    if (!body) {
        throw new ApiError("Request body is required", 400);
    }
    if (!body.item) {
        throw new ApiError("Item is required", 400);
    }

    if (typeof body.item !== "string") {
        throw new ApiError("Item must be a string", 400);
    }

    if (body.item.trim().length === 0) {
        throw new ApiError("Item cannot be empty", 400);
    }

    if (body.item.length > 255) {
        throw new ApiError("Item cannot exceed 255 characters", 400);
    }
        return body.item.trim();
}

function validateMoveItem(body, params) {
    if (!body) {
        throw new ApiError("Request body is required", 400);
    }

    const id = Number(params.id);
    const position = Number(body.position);

    if (!Number.isInteger(id) || id < 1) {
        throw new ApiError("Invalid item id", 400);
    }

    if (body.position === undefined) {
        throw new ApiError("Position is required", 400);
    }

    if (!Number.isInteger(position)) {
        throw new ApiError("Position must be an integer", 400);
    }

    if (position < 1) {
        throw new ApiError("Position must be greater than 0", 400);
    }

    return {
        id,
        position
    };
}

function validateDeleteItem(params) {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id < 1) {
        throw new ApiError("Invalid item id", 400);
    }
    return id;
}
function validateListId(params) {
    const listId = Number(params.id);

    if (!Number.isInteger(listId) || listId < 1) {
        throw new ApiError("Invalid list id", 400);
    }
    return listId;
}


function validateItemId(params) {
    const id = Number(params.id);

    if (!Number.isInteger(id) || id < 1) {
        throw new ApiError("Invalid item id", 400);
    }

    return id;
}

module.exports = {
    validateCreateList
    , validateAddItem,
    validateMoveItem,
    validateDeleteItem,
    validateItemId,
    validateListId
};