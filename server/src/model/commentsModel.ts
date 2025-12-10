import { model, Schema } from "mongoose";
import { IComment } from "../_types/comment";

const commentSchema = new Schema<IComment>({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },

}, { timestamps: true });

export const CommentModel = model("Comment", commentSchema);
