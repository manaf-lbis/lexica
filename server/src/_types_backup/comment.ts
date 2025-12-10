import { Document, Types } from "mongoose";

export interface IComment extends Document{
    _id: Types.ObjectId;
    articleId: Types.ObjectId;
    userId: Types.ObjectId;
    comment: string;
}