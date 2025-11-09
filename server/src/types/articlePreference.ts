import { Document, Types } from "mongoose"
import { ArticleCategories } from "../constants/categories"

export interface IArticlePrefrence extends Document {
    _id: Types.ObjectId,
    userId : Types.ObjectId,
    prefrence : ArticleCategories[],
}