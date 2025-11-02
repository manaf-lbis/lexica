import { StatusCodes } from "../types/statusCodes"; 

class ApiError extends Error {
    statusCode: StatusCodes;
    success: boolean;
    error: any

    constructor(message: string, errorData: any, statusCode?: StatusCodes) {
        super(message);
        this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        this.success = false;
        this.message = message;
        this.error = errorData
    }

}

export default ApiError;



