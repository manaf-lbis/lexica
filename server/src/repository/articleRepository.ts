import { Types } from "mongoose";
import { ArticleModel } from "../model/articleModel";
import { IArticle } from "../types/article";
import { BaseRepository } from "./baseRepository";
import { IArticleRepository } from "./interface/IArticleRepository";

export class ArticleRepository extends BaseRepository<IArticle> implements IArticleRepository {

    constructor() {
        super(ArticleModel)
    }

    async getTrending(): Promise<IArticle[]> {
        return await ArticleModel.find().populate('authorId', 'name avatar -_id').limit(3);
    };

    async findByIdUpdateAndReturn(id: Types.ObjectId): Promise<IArticle | null> {
        return await ArticleModel.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }, { new: true })
        .populate('authorId', 'name avatar -_id');
    }

    async findArticlesForRecomentation(category: string, dontRecomentId: Types.ObjectId): Promise<IArticle[]> {
        return await ArticleModel.find({ category, _id: { $ne: dontRecomentId } }, { views: 1, authorId: 1, title: 1, category: 1 })
            .sort({ views: -1 })
            .limit(3)
            .populate({
                path: "authorId",
                select: "name avatar",
            });
    }


}