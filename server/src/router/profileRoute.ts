import Router from "express";
import { authentication } from "../middleware/authentication";
import { ProfileController } from "../controller/profileController";
import { ProfileService } from "../service/profileService";
import { ArticlePrefrenceRepo } from "../repository/articlePrefrenceRepo";
import { UserRepository } from "../repository/userRepository";


const articlePrefrenceRepo = new ArticlePrefrenceRepo()
const userRepository = new UserRepository()
const profileService = new ProfileService(userRepository, articlePrefrenceRepo)
const profileController = new ProfileController(profileService)



const router = Router();

router.get('/', authentication, profileController.getProfile.bind(profileController));
router.patch('/', authentication, profileController.updateProfile.bind(profileController));
router.patch('/avatar', authentication, profileController.updateAvatar.bind(profileController));





export default router