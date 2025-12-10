import { Types } from "mongoose";
import { ArticleCategories } from "../constants/categories";
import { ArticlePrefrenceModel } from "../model/articlePreferenceModal";
import { IArticlePrefrence } from "../_types/articlePreference";
import { BaseRepository } from "./baseRepository";
import { IArticlePrefrenceRepo } from "./interface/IArticlePrefrenceRepo";

export class ArticlePrefrenceRepo extends BaseRepository<IArticlePrefrence> implements IArticlePrefrenceRepo {

    constructor() {
        super(ArticlePrefrenceModel)
    }

    async prefrenceUpdateByUserId(userId: Types.ObjectId, preference: ArticleCategories[]): Promise<IArticlePrefrence | null> {
        return await ArticlePrefrenceModel.findOneAndUpdate(
            { userId },
            { $set: { prefrence: preference } },
            {
                new: true,
                upsert: true,
            }
        );

    }

}