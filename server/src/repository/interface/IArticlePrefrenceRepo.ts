import { Types } from "mongoose";
import { IArticlePrefrence } from "../../types/articlePreference";
import { IBaseRepository } from "./IBaseRepository";
import { ArticleCategories } from "../../constants/categories";

export interface IArticlePrefrenceRepo extends IBaseRepository<IArticlePrefrence> {
    prefrenceUpdateByUserId(userId: Types.ObjectId, prefrence: ArticleCategories[]): Promise<IArticlePrefrence | null>


}