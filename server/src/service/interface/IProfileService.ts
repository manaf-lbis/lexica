import { Types } from "mongoose"
import { ArticleCategories } from "../../constants/categories"

export interface UserInfo {
    name: string,
    aboutMe: string,
    dateOfBirth: Date
}

export interface Email {
    email: string
}

export interface Categories {
    categories: ArticleCategories[]
}

export interface ProfileData extends UserInfo, Categories,Email {
    avatar: string | null
}

export interface IProfileService {
    getProfile(userId: Types.ObjectId): Promise<ProfileData>
    updateProfile(userId: Types.ObjectId, profileData: UserInfo): Promise<any>
    updateAvatar(userId: Types.ObjectId, avatar: string): Promise<any>
}

