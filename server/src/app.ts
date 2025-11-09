import express from 'express'
import cors from 'cors'
import appRoute from './router/appRoute'
import errorHandler from './middleware/errorHandler';
import dotenv from 'dotenv'
import { connectDB } from './config/db';
import cookieParser from 'cookie-parser';


const app = express();
dotenv.config();

connectDB()
app.use(express.json());
app.use(cookieParser());

console.log(process.env.CLIENT_URL);


app.use(cors({
    origin:process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));



app.use('/api', appRoute);




app.use(errorHandler);
app.listen(3000, () => console.log('Server running on port 3000'));