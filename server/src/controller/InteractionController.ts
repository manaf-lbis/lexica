import { isValidObjectId, Types } from "mongoose";
import ApiError from "../utils/apiError";
import { sendSuccess } from "../utils/apiSuccess";
import { NextFunction, Request, Response } from "express";
import { IInteractionService } from "../service/interface/IInteractionService";

export class InteractionController {

    constructor(
        private _interactionService: IInteractionService
    ) { }


    async viewComments(req: Request, res: Response, next: NextFunction) {
        try {
            const articleId = req.params.id;
            if (!articleId) throw new ApiError("Invalid article id");
            if (!isValidObjectId(articleId)) throw new ApiError("Invalid article id");
            const comments = await this._interactionService.viewComments(new Types.ObjectId(articleId as string));
            sendSuccess(res, comments, "Comments fetched successfully");

        } catch (error) {
            next(error);
        }
    }

    async addComment(req: Request, res: Response, next: Function) {
        try {
            const articleId = req.params?.id
            const { comment } = req.body;
            if (!articleId) throw new ApiError("Invalid article id");
            if (!isValidObjectId(articleId)) throw new ApiError("Invalid article id");
            const userId = req.user?.userId;
            if (comment.trim().length === 0) throw new ApiError("Invalid comment");

            await this._interactionService.addComment(userId!, new Types.ObjectId(articleId as string), comment.trim());
            sendSuccess(res, {}, "Comment added successfully");

        } catch (error) {
            next(error);
        }
    }

    async addLike(req: Request, res: Response, next: Function) {
        try {
            const  articleId  = req.params.id
            if (!articleId) throw new ApiError("Invalid article id");
            const userId = req.user?.userId;
            await this._interactionService.toggleLike(userId!, new Types.ObjectId(articleId!));
            sendSuccess(res, {}, "Like added successfully");
        } catch (error) {
            next(error);
        }
    }




}