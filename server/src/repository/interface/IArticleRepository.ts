import { Types } from "mongoose";
import { IArticle } from "../../types/article";
import { IBaseRepository } from "./IBaseRepository";

export interface IArticleRepository extends IBaseRepository<IArticle> {
    getTrending(): Promise<IArticle[]>
    findByIdUpdateAndReturn(id: Types.ObjectId): Promise<IArticle | null>
    findArticlesForRecomentation(category: string,dontRecomentId: Types.ObjectId): Promise<IArticle[]>

    
}