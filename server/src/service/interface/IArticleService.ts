import { Types } from "mongoose";

export interface IArticleService {
    createArticle(userId: Types.ObjectId,title: string, about: string, category: string, content: string ): Promise<any>
    // getArticlesByUserId(userId: Types.ObjectId): Promise<IArticle[]>
    uploadImage(image: string): Promise<{publicId: string}>
    getTrendingArticles(): Promise<any>
    getArticleById(id: Types.ObjectId): Promise<any>
}