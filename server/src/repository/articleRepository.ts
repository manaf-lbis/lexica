import { ArticleModel } from "../model/articleModel";
import { IArticle } from "../types/article";
import { BaseRepository } from "./baseRepository";
import { IArticleRepository } from "./interface/IArticleRepository";

export class ArticleRepository extends BaseRepository<IArticle> implements IArticleRepository {

    constructor() { 
        super(ArticleModel)
    }

}