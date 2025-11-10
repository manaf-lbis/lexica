import { Router } from "express";
import authRoute from "./authRoute";
import profileRouter from "./profileRoute";
import articleRoute from "./articleRoute";

const router = Router();




router.use('/auth', authRoute);
router.use('/profile', profileRouter);
router.use('/article', articleRoute);




export default router