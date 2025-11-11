import { Types } from "mongoose";
import { IArticleRepository } from "../repository/interface/IArticleRepository";
import { ICommentRepository } from "../repository/interface/ICommentRepository";
import { IInteractionService } from "./interface/IInteractionService";
import { ILikeRepository } from "../repository/interface/ILikeRepository";

export class InteractionService implements IInteractionService {

    constructor(
        private _likeRepository: ILikeRepository,
        private _commentRepository: ICommentRepository

    ) { }

    async addComment(userId: Types.ObjectId, articleId: Types.ObjectId, comment: string): Promise<any> {
        return await this._commentRepository.create({userId, articleId, comment})
    }

    async toggleLike(userId: Types.ObjectId, articleId: Types.ObjectId): Promise<any> {
        const isLiked = await this._likeRepository.find({ userId, articleId });

        if(isLiked.length > 0) {
            await this._likeRepository.delete(isLiked[0]._id);
        } else {
            await this._likeRepository.create({ userId, articleId });
        }
        
    }

    async viewComments(articleId: Types.ObjectId): Promise<any> {
        return await this._commentRepository.getCommentsOfArticle(articleId);
    }

}