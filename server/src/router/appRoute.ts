import { Router } from "express";
import authRoute from "./authRoute";
import profileRouter from "./profileRoute";
import articleRoute from "./articleRoute";
import interactionRoute from "./interactionsRoute";

const router = Router();




router.use('/auth', authRoute);
router.use('/profile', profileRouter);
router.use('/article', articleRoute);
router.use('/interactions', interactionRoute);



export default router