import { Types } from "mongoose";
import { IComment } from "../../types/comment";
import { IBaseRepository } from "./IBaseRepository";

export interface ICommentRepository extends IBaseRepository<IComment> {
    getCommentsOfArticle(articleId: Types.ObjectId): Promise<IComment[]>

    
}