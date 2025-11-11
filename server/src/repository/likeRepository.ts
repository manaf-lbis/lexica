import { Types } from "mongoose";
import { LikeModel } from "../model/likeModel";
import { ILike } from "../types/like";
import { BaseRepository } from "./baseRepository";
import { ILikeRepository } from "./interface/ILikeRepository";

export class LikeRepository extends BaseRepository<ILike> implements ILikeRepository {
    constructor() {
        super(LikeModel);
    }



    async checkIsLiked(articleId: Types.ObjectId, userId?: Types.ObjectId): Promise<boolean> {
        if(!userId) return false
        const like = await LikeModel.findOne({ userId, articleId });
        return like !== null;
    }



} 