// This middleware function checks if an error is a SyntaxError caused by invalid JSON in the request body.
function invalidJsonFormat(err, req, res, next) {
    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: "Invalid JSON format",
            data: null
        });
    }

    next(err);
}

module.exports = invalidJsonFormat;