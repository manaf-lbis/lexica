import { Types } from "mongoose";

export interface IInteractionService {
    addLike(userId: Types.ObjectId, articleId: Types.ObjectId): Promise<any>;
    addComment(userId: Types.ObjectId, articleId: Types.ObjectId, comment: string): Promise<any>;
    viewComments(articleId: Types.ObjectId): Promise<any>;
}