import { Types } from "mongoose";
import { IArticleService } from "./interface/IArticleService";
import { IArticleRepository } from "../repository/interface/IArticleRepository";
import { uploadToCloudinary } from "../utils/cloudinaryUtility";
import ApiError from "../utils/apiError";
import { ILikeRepository } from "../repository/interface/ILikeRepository";

export class ArticleService implements IArticleService {

    constructor(
        private _articleRepository: IArticleRepository,
        private _likeRepository: ILikeRepository

    ) { }

    async uploadImage(image: string): Promise<{ publicId: string; }> {
        const result = await uploadToCloudinary(image, "article");
        return { publicId: result.publicId };
    }

    async createArticle(userId: Types.ObjectId, title: string, about: string, category: string, content: string): Promise<any> {

        return await this._articleRepository.create({
            authorId: userId,
            title: title,
            about: about,
            category: category,
            content: content
        });
    };

    async getTrendingArticles(): Promise<any> {
        return await this._articleRepository.getTrending();
    };

    async readingRecomendation(categories: string): Promise<any> {
        return await this._articleRepository.getTrending();
    };

    async getArticleById(id: Types.ObjectId, userId?: Types.ObjectId): Promise<any> {
        const article = await this._articleRepository.findByIdUpdateAndReturn(id);
        if (!article) throw new ApiError("Article not found", 404);

        if (article.isBlocked) throw new ApiError("Article is blocked by author only Edit Preview is allowed.", 404);
        const recomendations = await this._articleRepository.findArticlesForRecomentation(article.category, article._id);
        const isLiked = await this._likeRepository.checkIsLiked(article._id, userId)

        return { article:{...article, isLiked}, recomendations };
    }

    async getArticleForEdit(articleId: Types.ObjectId, userId: Types.ObjectId): Promise<any> {
        const article = await this._articleRepository.findById(articleId);
        if (!article) throw new Error("Article not found");
        if (article.authorId.toString() !== userId.toString()) throw new Error("You are not allowed to edit this article");
        return article;
    }

    async updateArticle(userId: Types.ObjectId, articleId: Types.ObjectId, title: string, about: string, category: string, content: string): Promise<any> {
        const article = await this._articleRepository.findById(articleId);
        if (!article) throw new Error("Article not found");
        if (article.authorId.toString() !== userId.toString()) throw new Error("You are not allowed to edit this article");
        return await this._articleRepository.update(articleId, { title, about, category, content });
    }

    async visiblityToggle(userId: Types.ObjectId, articleId: Types.ObjectId, visibility: boolean): Promise<any> {
        const article = await this._articleRepository.findById(articleId);
        if (!article) throw new Error("Article not found");
        if (article.authorId.toString() !== userId.toString()) throw new Error("You are not allowed to edit this article");
        return await this._articleRepository.update(articleId, { isBlocked: visibility });
    }

    async getMyArticles(userId: Types.ObjectId, page: number): Promise<any> {

        const itemsPerPage = Number(process.env.ITEMS_PER_PAGE)
        const from = (page - 1) * itemsPerPage;
        const to = page * itemsPerPage;

        const articles = await this._articleRepository.myArticles(userId, from, to, itemsPerPage);
        const stats = await this._articleRepository.myArticlesStats(new Types.ObjectId(userId));

        return { itemsPerPage, currrentPage: page, articles, stats };
    }



}