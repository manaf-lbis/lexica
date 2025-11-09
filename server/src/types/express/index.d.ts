import { JwtPayload } from "jsonwebtoken";
import { TokenPayload } from "../../utils/token";
import { Types } from "mongoose";


declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {}; 