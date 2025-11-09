import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import { verifyToken } from "../utils/token";

export const authentication = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    try {
        if (!token) throw new ApiError("Unauthorized", 401);

        const userData = verifyToken(token);
        if (!userData) throw new ApiError("Unauthorized", 401);

        req.user = userData;
        next();

    } catch (error) {
        throw new ApiError("Unauthorized", 401);
    }


}