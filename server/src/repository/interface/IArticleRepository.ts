import { Types } from "mongoose";
import { IArticle } from "../../types/article";
import { IBaseRepository } from "./IBaseRepository";

export interface IArticleRepository extends IBaseRepository<IArticle> {
    getTrending(): Promise<IArticle[]>
    findByIdUpdateAndReturn(id: Types.ObjectId): Promise<any>
    findArticlesForRecomentation(category: string,dontRecomentId: Types.ObjectId): Promise<IArticle[]>
    myArticles(userId: Types.ObjectId, from: number,to: number, limit: number): Promise<IArticle[]>
    myArticlesStats(userId: Types.ObjectId): Promise<{ totalArticles: number, totalViews: number, blockedCount: number }>

    
}

