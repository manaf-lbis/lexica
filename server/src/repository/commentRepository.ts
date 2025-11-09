import { CommentModel } from "../model/commentsModel";
import { IComment } from "../types/comment";
import { BaseRepository } from "./baseRepository";
import { ICommentRepository } from "./interface/ICommentRepository";

export class CommentRepository extends BaseRepository<IComment> implements ICommentRepository {

    constructor() { 
        super(CommentModel)
    }

}