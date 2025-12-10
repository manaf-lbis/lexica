import { model, Schema } from "mongoose";
import { ILike } from "../_types/like";

const likeSchema = new Schema<ILike>({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article",
    required: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  isLiked: {
    type: Boolean,
    default: true
  },

}, { timestamps: true });

likeSchema.index({ articleId: 1, userId: 1 }, { unique: true });

export const LikeModel = model("Like", likeSchema);
