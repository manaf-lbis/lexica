import { Router } from "express";
import authRoute from "./authRoute";

const router = Router();




router.use('/auth', authRoute);



router.get('/test', (req, res) => {
    res.json({
        message: 'test',
        status: 200,
        serverStatus: 'ok',
        timestamp: new Date()
    })
})



export default router