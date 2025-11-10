import { Router } from "express";
import { AuthController } from "../controller/authController";
import { AuthService } from "../service/authService";
import { UserRepository } from "../repository/userRepository";
import { OtpRepository } from "../repository/otpRepository";
import { authentication } from "../middleware/authentication";

const router = Router();


const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const authService = new AuthService(userRepository, otpRepository)


const authController = new AuthController(authService);


router.post('/login', authController.login.bind(authController));
router.post('/signup', authController.signup.bind(authController));
router.post('/verify-otp', authController.verifySignupOtp.bind(authController));
router.post('/logout', authentication, authController.logout.bind(authController));
router.post('/resent-otp', authController.resentOtp.bind(authController));

router.post('/forgot-password', authController.forgotPassword.bind(authController));
router.post('/forgot-password/verify-otp', authController.verifyResetOtp.bind(authController));
router.post('/forgot-password/set-new-password', authController.resetPassword.bind(authController));
router.post('/forgot-password/resent-otp', authController.resentResetOtp.bind(authController));


router.get('/validate', authentication, authController.validateUser.bind(authController));



export default router