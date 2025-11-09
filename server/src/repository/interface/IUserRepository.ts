import { Types } from "mongoose";
import { IUser } from "../../types/user";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
    findByEmail(email: string): Promise<IUser | null>
    clearRefreshToken(userId: Types.ObjectId): Promise<void>

    
}