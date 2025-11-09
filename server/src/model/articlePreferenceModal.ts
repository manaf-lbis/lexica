import mongoose, { Schema } from "mongoose";
import { IArticlePrefrence } from "../types/articlePreference";
import { ArticleCategories } from "../constants/categories";

const articlePreferenceModal = new Schema<IArticlePrefrence>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    prefrence: [{
        type: String,
        enum: Object.values(ArticleCategories),
    }]

}, { timestamps: true });



export const ArticlePrefrenceModel = mongoose.model("ArticlePrefrence", articlePreferenceModal);