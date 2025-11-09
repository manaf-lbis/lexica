import { Schema, model } from "mongoose";
import { ArticleCategories } from "../constants/categories";
import { ArticleStatus, IArticle } from "../types/article";

const articleSchema = new Schema<IArticle>({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 150,
    },
    about: {
        type: String,
        trim: true,
        maxlength: 300,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: Object.values(ArticleCategories),
        default: ArticleCategories.General,
    },
    coverImage: {
        url: String,
        publicId: String,
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    },
    status: {
        type: String,
        enum: Object.values(ArticleStatus),
        index: true,
    },
    views: {
        type: Number,
        default: 0,
    },
}, { timestamps: true, versionKey: false });

export const ArticleModel = model("Article", articleSchema);
