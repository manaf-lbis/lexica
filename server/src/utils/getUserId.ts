import { Request } from "express";
import { TokenPayload, verifyToken } from "./token";

export const fetchUserIfAuthenticated = async (req: Request):Promise<TokenPayload | null> => {
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    if(!token) return null;
    return verifyToken(token);
}