import express from 'express';
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { connectDB } from './lib/db.js';
import {app, server} from './lib/socket.js';
dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(cors ({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}
server.listen(PORT, ()=>{
    console.log('Server is running on port 5001');
    connectDB();
})