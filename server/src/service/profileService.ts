import { Types } from "mongoose";
import { IProfileService, ProfileData } from "./interface/IProfileService";
import { IUserRepository } from "../repository/interface/IUserRepository";
import { ArticlePrefrenceRepo } from "../repository/articlePrefrenceRepo";
import { ArticleCategories } from "../constants/categories";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinaryUtility";

export class ProfileService implements IProfileService {

    constructor(
        private _userRepository: IUserRepository,
        private _articlePrefrenceRepository: ArticlePrefrenceRepo
    ) { }

    async getProfile(userId: Types.ObjectId): Promise<ProfileData> {

        const user = await this._userRepository.findUserWithPrefrences(userId);

        if (!user) throw new Error("User not found");

        return {
            avatar: user?.avatar || null,
            aboutMe: user.aboutMe,
            dateOfBirth: user.dateOfBirth,
            name: user.name,
            email: user.email,
            categories: Object.values(ArticleCategories)
        };


    }

    async updateProfile(userId: Types.ObjectId, profileData: any): Promise<any> {
        return await this._userRepository.update(userId, profileData);
    }

    async updateAvatar(userId: Types.ObjectId, avatar: string): Promise<any> {
        const result = await uploadToCloudinary(avatar, "avatar");
        const user = await this._userRepository.findById(userId);
        if (user?.avatar) {
            await deleteFromCloudinary(user.avatar);
        }
        await this._userRepository.update(userId, { avatar: result.publicId });
    }


}