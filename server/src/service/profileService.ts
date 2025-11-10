import { Types } from "mongoose";
import { IProfileService, ProfileData } from "./interface/IProfileService";
import { IUserRepository } from "../repository/interface/IUserRepository";
import { ArticleCategories } from "../constants/categories";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinaryUtility";
import { IArticlePrefrenceRepo } from "../repository/interface/IArticlePrefrenceRepo";

export class ProfileService implements IProfileService {

    constructor(
        private _userRepository: IUserRepository,
        private _articlePrefrenceRepository: IArticlePrefrenceRepo
    ) { }

    async getProfile(userId: Types.ObjectId): Promise<ProfileData> {

        const user = await this._userRepository.findUserWithPrefrences(userId);

        const userPrefrence = new Set(user?.prefrences?.prefrence || [])
        const categories = Object.values(ArticleCategories).map((category: string) => {
            return {
                id: category,
                name: category,
                isPrefered: userPrefrence.has(category)
            }
        })


        if (!user) throw new Error("User not found");

        return {
            avatar: user?.avatar || null,
            aboutMe: user.aboutMe,
            dateOfBirth: user.dateOfBirth,
            name: user.name,
            email: user.email,
            categories: categories
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

    async updateCategoryPrefrences(userId: Types.ObjectId, categoryPrefrences: ArticleCategories[]): Promise<any> {
        const result = await this._articlePrefrenceRepository.prefrenceUpdateByUserId(userId, categoryPrefrences);
        await this._userRepository.update(userId, { prefrences: result?._id });
    }


}