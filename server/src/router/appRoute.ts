import { Router } from "express";
import authRoute from "./authRoute";
import ApiError from "../utils/apiError";

const router = Router();




router.use('/auth', authRoute);
router.use('/v1', authRoute);




export default router