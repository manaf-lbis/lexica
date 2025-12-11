import express from 'express'
import cors from 'cors'
import appRoute from './router/appRoute'
import errorHandler from './middleware/errorHandler';
import dotenv from 'dotenv'
import { connectDB } from './config/db';
import cookieParser from 'cookie-parser';


const app = express();
dotenv.config();

app.set("trust proxy", 1);
connectDB()
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());



app.use(cors({
    origin:process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    credentials: true
}));


app.use('/api', appRoute);




app.use(errorHandler);
app.listen(3000, () => console.log('Server running on port 3000'));