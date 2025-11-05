import { Router } from "express";
import authRoute from "./authRoute";
import ApiError from "../utils/apiError";

const router = Router();




router.use('/auth', authRoute);





router.get('/test', (req, res) => {
    throw new ApiError('test',500,{})
    res.json({
        message: 'test',
        status: 200,
        serverStatus: 'ok',
        timestamp: new Date()
    })
})



export default router