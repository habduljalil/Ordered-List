class ApiError extends Error {
 // provides a consistent structure for API errors, making it easier to handle and format error responses across the application.
 // By extending the built-in Error class, ApiError can be thrown and caught like any standard error, while also carrying additional information such as a status code.
    constructor(message = "Internal Server Error", statusCode = 500) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }

}

module.exports = ApiError;