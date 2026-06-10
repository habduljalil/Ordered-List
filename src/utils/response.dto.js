// The ResponseDto class provides a standardized way to format API responses,
// ensuring consistency across the application.
class ResponseDto {

    static success(message, data = null) {
        return {
            success: true,
            message,
            data
        };
    }

    static error(message, code = null) {
        return {
            code,
            success: false,
            message,
            data: null
        };
    }

}

module.exports = ResponseDto;
