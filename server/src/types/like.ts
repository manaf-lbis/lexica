import { Document, Types } from "mongoose";

export interface ILike extends Document{
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    articleId: Types.ObjectId;
    isLiked: boolean
}

