import { Types } from "mongoose";
import { IArticleService } from "./interface/IArticleService";
import { IArticleRepository } from "../repository/interface/IArticleRepository";
import { uploadToCloudinary } from "../utils/cloudinaryUtility";

export class ArticleService implements IArticleService {

    constructor(
        private _articleRepository: IArticleRepository

    ) { }

    async uploadImage(image: string): Promise<{ publicId: string; }> {
        const result = await uploadToCloudinary(image, "article");
        return { publicId: result.publicId};
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

    async getArticleById(id: Types.ObjectId): Promise<any> {
        const article = await this._articleRepository.findByIdUpdateAndReturn(id);
        if(!article) throw new Error("Article not found");
        const recomendations = await this._articleRepository.findArticlesForRecomentation(article.category,article._id);


        return { article, recomendations };
    }



}