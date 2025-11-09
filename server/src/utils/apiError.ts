import { StatusCodes } from "../types/statusCodes";

class ApiError extends Error {
    statusCode: StatusCodes;
    success: boolean;
    error: any

    constructor(message: string, statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR, errorData?: any) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.message = message;
        this.error = errorData
    }

}

export default ApiError;



