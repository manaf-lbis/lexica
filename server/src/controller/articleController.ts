import { NextFunction, Request, Response } from "express";
import { isValidObjectId, set, Types } from "mongoose";
import { ArticleCategories } from "../constants/categories";
import { sendSuccess } from "../utils/apiSuccess";
import { IArticleService } from "../service/interface/IArticleService";
import ApiError from "../utils/apiError";
import { fetchUserIfAuthenticated } from "../utils/getUserId";

export class ArticleController {
    constructor(
        private _articleService: IArticleService

    ) { };

    async imageUpload(req: Request, res: Response, next: NextFunction) {
        try {
            const image = req.body?.image
            if (!image) throw new ApiError("Image is required");

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
            if (!title.trim()) throw new ApiError("Title is required");
            if (!about.trim()) throw new ApiError("About is required");
            if (!category.trim()) throw new ApiError("Category is required");
            if (!content.trim()) throw new ApiError("Content is required");
            if (!Object.values(ArticleCategories).includes(category)) throw new ApiError("Invalid category");

            const article = await this._articleService.createArticle(userId!, title, about, category, content);
            sendSuccess(res, {}, "Article published successfully");

        } catch (error) {
            next(error);
        }
    }

    async getTrendingArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await fetchUserIfAuthenticated(req);
            const articles = await this._articleService.getTrendingArticles(user?.userId);
            sendSuccess(res, articles, "Articles fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async getArticleById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await fetchUserIfAuthenticated(req);

            if (!isValidObjectId(id)) throw new ApiError("Invalid article id");
            const articleId = new Types.ObjectId(id);
            const article = await this._articleService.getArticleById(articleId, user?.userId);
            sendSuccess(res, article, "Article fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async getArticleForEdit(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!isValidObjectId(id)) throw new ApiError("Invalid article id");
            const articleId = new Types.ObjectId(id);
            const article = await this._articleService.getArticleForEdit(articleId, userId!);
            sendSuccess(res, article, "Article fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async updateArticle(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, about, category, content } = req.body;
            const userId = req.user?.userId;
            const { id } = req.params;
            if (!isValidObjectId(id)) throw new ApiError("Invalid article id");
            const articleId = new Types.ObjectId(id);
            if (!title.trim()) throw new ApiError("Title is required");
            if (!about.trim()) throw new ApiError("About is required");
            if (!category.trim()) throw new ApiError("Category is required");
            if (!content.trim()) throw new ApiError("Content is required");
            if (!Object.values(ArticleCategories).includes(category)) throw new ApiError("Invalid category");

            const article = await this._articleService.updateArticle(userId!, articleId, title, about, category, content);
            sendSuccess(res, {}, "Article updated successfully");
        } catch (error) {
            next(error);
        }
    }


    async visiblityToggle(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            const visibility = req.body.visibility
            if (!isValidObjectId(id)) throw new ApiError("Invalid article id");
            const articleId = new Types.ObjectId(id);
            const article = await this._articleService.visiblityToggle(userId!, articleId, visibility);
            sendSuccess(res, article, "Article updated successfully");
        } catch (error) {
            next(error);
        }
    }

    async getMyArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const page = Number(req.query?.page) || 1
            const articles = await this._articleService.getMyArticles(userId!, page);
            sendSuccess(res, articles, "Articles fetched successfully");
        } catch (error) {
            next(error);
        }
    }

    async searchArticles(req: Request, res: Response, next: NextFunction) {
        try {
            const { query, category } = req.query;
            const page = Number(req.query?.page) || 1
            const user = await fetchUserIfAuthenticated(req);

            const articles = await this._articleService.searchArticles(query as string, page, user?.userId,category as string);


            sendSuccess(res, articles, "Articles fetched successfully");
        } catch (error) {
            next(error);
        }
    }





}