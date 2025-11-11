import { Types } from "mongoose";

export interface IInteractionService {
    toggleLike(userId: Types.ObjectId, articleId: Types.ObjectId): Promise<any>;
    addComment(userId: Types.ObjectId, articleId: Types.ObjectId, comment: string): Promise<any>;
    viewComments(articleId: Types.ObjectId): Promise<any>;
}