import { Types } from "mongoose";

export interface IArticleService {
    createArticle(userId: Types.ObjectId,title: string, about: string, category: string, content: string ): Promise<any>
    // getArticlesByUserId(userId: Types.ObjectId): Promise<IArticle[]>
    uploadImage(image: string): Promise<{publicId: string}>
    getTrendingArticles(userId?: Types.ObjectId): Promise<any>
    getArticleById(id: Types.ObjectId,userId?: Types.ObjectId): Promise<any>
    getArticleForEdit(articleId: Types.ObjectId, userId: Types.ObjectId): Promise<any>
    updateArticle(userId: Types.ObjectId, articleId: Types.ObjectId, title: string, about: string, category: string, content: string): Promise<any>
    visiblityToggle(userId: Types.ObjectId, articleId: Types.ObjectId, visibility: boolean): Promise<any>
    getMyArticles(userId: Types.ObjectId,page: number): Promise<any>
    searchArticles(query: string, page: number,userId?: Types.ObjectId ,category?: string ): Promise<any>

}