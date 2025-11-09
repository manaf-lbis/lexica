import { UserModel } from "../model/userModel";
import { IUser } from "../types/user";
import { BaseRepository } from "./baseRepository";
import { IUserRepository } from "./interface/IUserRepository";

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {

    constructor() { 
        super(UserModel)
    };

    async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email }).exec();
    }


}