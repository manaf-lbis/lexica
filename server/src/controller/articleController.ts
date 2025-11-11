import { NextFunction, Request, Response } from "express";
import { isValidObjectId, set, Types } from "mongoose";
import { ArticleCategories } from "../constants/categories";
import { sendSuccess } from "../utils/apiSuccess";
import { IArticleService } from "../service/interface/IArticleService";

export class ArticleController {
    constructor(
        private _articleService: IArticleService

    ) { };

    async imageUpload(req: Request, res: Response, next: NextFunction) {
        try {
            const image = req.body?.image
            if (!image) throw new Error("Image is required");

            const publicId = await this._articleService.uploadImage(image);

            sendSuccess(res, publicId, "Image uploaded successfully");
        } catch (error) {
            next(error);
        }
    }

    async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = Object.values(ArticleCategories);
            sendSuccess(res, categories, "Categories fetched successfully");
        } catch (error) {
            next(error);
        }

    }


    async publish(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, about, category, content } = req.body;

            const userId = req.user?.userId;
            if (!title.trim()) throw new Error("Title is required");
            if (!about.trim()) throw new Error("About is required");
            if (!category.trim()) throw new Error("Category is required");
            if (!content.trim()) throw new Error("Content is required");
            if (!Object.values(ArticleCategories).includes(category)) throw new Error("Invalid category");

            const article = await this._articleService.createArticle(userId!, title, about, category, content);
            sendSuccess(res, {}, "Article published successfully");

        } catch (error) {
            next(error);
        }
    }

    async getTrendingArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const articles = await this._articleService.getTrendingArticles();
            sendSuccess(res, articles, "Articles fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async getArticleById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if(!isValidObjectId(id)) throw new Error("Invalid article id");
            const articleId = new Types.ObjectId(id);
            const article = await this._articleService.getArticleById(articleId);
            sendSuccess(res, article, "Article fetched successfully");
        } catch (error) {
            next(error);
        }
    }





}