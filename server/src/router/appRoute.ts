import { Router } from "express";
import authRoute from "./authRoute";
import profileRouter from "./profileRoute";

const router = Router();




router.use('/auth', authRoute);
router.use('/profile', profileRouter);




export default router