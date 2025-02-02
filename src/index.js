import express from 'express';
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './lib/db.js';

dotenv.config();
const PORT = process.env.PORT || 5001
const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(cors ({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

app.listen(PORT, ()=>{
    console.log('Server is running on port 5001');
    connectDB();
})