import { Types } from "mongoose";
import { CommentModel } from "../model/commentsModel";
import { IComment } from "../types/comment";
import { BaseRepository } from "./baseRepository";
import { ICommentRepository } from "./interface/ICommentRepository";

export class CommentRepository extends BaseRepository<IComment> implements ICommentRepository {

    constructor() { 
        super(CommentModel)
    }

    async getCommentsOfArticle(articleId: Types.ObjectId): Promise<IComment[]> {
        return await CommentModel.find({articleId})
        .populate('userId', 'name avatar -_id')
        .select('-articleId, -updatedAt -__v')
    }

}