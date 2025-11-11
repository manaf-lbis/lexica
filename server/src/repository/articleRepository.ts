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
        return await ArticleModel.find({isBlocked: false}).populate('authorId', 'name avatar -_id').limit(6);
    };

    async findByIdUpdateAndReturn(id: Types.ObjectId): Promise<IArticle | null> {
        return await ArticleModel.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }, { new: true })
            .populate('authorId', 'name avatar -_id');
    }

    async findArticlesForRecomentation(category: string, dontRecomentId: Types.ObjectId): Promise<IArticle[]> {
        return await ArticleModel.find({ category, _id: { $ne: dontRecomentId } , isBlocked: false }, { views: 1, authorId: 1, title: 1, category: 1 })
            .sort({ views: -1 })
            .limit(3)
            .populate({
                path: "authorId",
                select: "name avatar",
            });
    }

    async myArticles(userId: Types.ObjectId, from: number, to: number, limit: number): Promise<IArticle[]> {
        return await ArticleModel.find({ authorId: userId }, { views: 1, authorId: 1, title: 1, category: 1, createdAt: 1,isBlocked: 1 })
            .sort({ createdAt: -1 })
            .skip(from)
            .limit(limit)
            .populate("authorId", "name avatar");
    }

    async myArticlesStats(userId: Types.ObjectId): Promise<{ totalArticles: number, totalViews: number, blockedCount: number }> {
        const result = await ArticleModel.aggregate([
            { $match: { authorId: userId } },
            {
                $group: {
                    _id: null,
                    totalArticles: { $sum: 1 },
                    totalViews: { $sum: "$views" },
                    blockedCount: {
                        $sum: {
                            $cond: [{ $eq: ["$isBlocked", true] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        return result[0] || { totalArticles: 0, totalViews: 0, blockedCount: 0 };
    }




}