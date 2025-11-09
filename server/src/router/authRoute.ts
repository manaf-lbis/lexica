import { Router } from "express";
import { AuthController } from "../controller/authController";
import { AuthService } from "../service/authService";
import { UserRepository } from "../repository/userRepository";
import { OtpRepository } from "../repository/otpRepository";

const router = Router();


const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const authService = new AuthService(userRepository, otpRepository)


const authController = new AuthController(authService);


router.post('/login', authController.login.bind(authController));
router.post('/signup', authController.signup.bind(authController));
router.post('/verify-otp', authController.verifySignupOtp.bind(authController));


router.post('/logout', authController.logout.bind(authController));
router.post('/forgot-password', authController.login.bind(authController));

router.post('/resent-otp', authController.login.bind(authController));

router.get('/validate', authController.validateUser.bind(authController));





export default router