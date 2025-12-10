import { Types } from "mongoose";
import { ILike } from "../../_types/like";
import { IBaseRepository } from "./IBaseRepository";

export interface ILikeRepository extends IBaseRepository<ILike> {
    checkIsLiked(articleId: Types.ObjectId, userId?: Types.ObjectId): Promise<boolean>;


}