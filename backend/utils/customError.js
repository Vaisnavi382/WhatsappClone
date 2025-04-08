// Custom Error Class
class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const cookieOptions = {
    httpOnly: true,
    secure: true,
};

export default CustomError;