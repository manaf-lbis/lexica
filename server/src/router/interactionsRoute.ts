import Router from 'express';
import { InteractionController } from '../controller/InteractionController';
import { authentication } from '../middleware/authentication';
import { InteractionService } from '../service/InteractionService';
import { LikeRepository } from '../repository/likeRepository';
import { CommentRepository } from '../repository/commentRepository';


const router = Router();

const likeRepository = new LikeRepository()
const commentRepository = new CommentRepository()

const interactionService = new InteractionService(likeRepository, commentRepository)
const interactionController = new InteractionController(interactionService)


router.get('/:id/comments', interactionController.viewComments.bind(interactionController))
router.post('/like', authentication, interactionController.addLike.bind(interactionController))
router.post('/:id/comment', authentication, interactionController.addComment.bind(interactionController))





export default router
