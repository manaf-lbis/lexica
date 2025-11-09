import { Document, Types } from "mongoose";

export interface IArticle extends Document {
    _id: string;
    title: string;
    about: string;
    content: string;
    category: string;
    coverImage: {
        url: string;
        publicId: string;
    };
    authorId: Types.ObjectId;
    status: ArticleStatus;
    views: number;
}

export enum ArticleStatus {
    Draft = "draft",
    Published = "published"
}


