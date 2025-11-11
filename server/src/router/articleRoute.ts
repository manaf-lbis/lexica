import Router from 'express';
import { ArticleController } from '../controller/articleController';
import { authentication } from '../middleware/authentication';
import { ArticleService } from '../service/ArticleService';
import { ArticleRepository } from '../repository/articleRepository';
import { LikeRepository } from '../repository/likeRepository';
import { ArticlePrefrenceRepo } from '../repository/articlePrefrenceRepo';

const articleRepository = new ArticleRepository()
const likeRepository = new LikeRepository()
const articelPrefrenceRepository = new ArticlePrefrenceRepo()
const articleService = new ArticleService(articleRepository, likeRepository, articelPrefrenceRepository)
const articleController = new ArticleController(articleService)

const router = Router();

router.post('/image-upload', authentication, articleController.imageUpload.bind(articleController));
router.get('/categories', articleController.getCategories.bind(articleController));
router.post('/publish', authentication, articleController.publish.bind(articleController));


router.get('/search', articleController.searchArticles.bind(articleController));
router.get('/my-articles', authentication, articleController.getMyArticles.bind(articleController));
router.get('/trending', articleController.getTrendingArticles.bind(articleController));
router.get('/edit/:id', authentication, articleController.getArticleForEdit.bind(articleController));
router.patch('/:id/update', authentication, articleController.getArticleForEdit.bind(articleController));
router.patch('/:id/visibility', authentication, articleController.visiblityToggle.bind(articleController));
router.get('/:id', articleController.getArticleById.bind(articleController));





export default router