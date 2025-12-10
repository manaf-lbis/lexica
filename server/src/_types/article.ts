import { Document, Types } from "mongoose";

export interface IArticle extends Document {
    _id: Types.ObjectId;
    title: string;
    about: string;
    content: string;
    category: string;
    coverImage?: string;
    isBlocked: boolean;
    authorId: Types.ObjectId;
    status: ArticleStatus;
    views: number;
}

export enum ArticleStatus {
    Draft = "draft",
    Published = "published"
}


