import { ArticlePrefrenceModel } from "../model/articlePreferenceModal";
import { IArticlePrefrence } from "../types/articlePreference";
import { BaseRepository } from "./baseRepository";
import { IArticlePrefrenceRepo } from "./interface/IArticlePrefrenceRepo";

export class ArticlePrefrenceRepo extends BaseRepository<IArticlePrefrence> implements IArticlePrefrenceRepo {

    constructor() { 
        super(ArticlePrefrenceModel)
    }

}