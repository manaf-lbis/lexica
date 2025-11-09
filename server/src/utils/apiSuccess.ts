import { StatusCodes } from "../types/statusCodes";

export const sendSuccess = (res: any, data: any, message: string = "Request successful", statusCode: StatusCodes = StatusCodes.OK) => {
    res.status(statusCode).json({
        success: true,
        message: message,
        data: data
    });
}