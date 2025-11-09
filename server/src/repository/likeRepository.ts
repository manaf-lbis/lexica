import { LikeModel } from "../model/likeModel";
import { ILike } from "../types/like";
import { BaseRepository } from "./baseRepository";
import { ILikeRepository } from "./interface/ILikeRepository";

export class LikeRepository extends BaseRepository<ILike> implements ILikeRepository {
    constructor() {
        super(LikeModel);
    }

} 