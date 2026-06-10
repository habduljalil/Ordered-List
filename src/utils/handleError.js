const ResponseDto = require("./response.dto");
// This function provides a centralized way to handle errors in the application.
//  It checks if the error object has a statusCode property, which can be set by custom errors thrown in the application.
//  If not, it defaults to 500 for internal server errors.
//  The response sent back to the client includes a message that is either the error's message or a generic
// "Internal server error" message for unexpected errors, along with the appropriate HTTP status code.
function handleError(res, error) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json(
    ResponseDto.error(
      statusCode === 500 ? "Internal server error" : error.message,
      statusCode
    )
  );
}

module.exports = handleError;