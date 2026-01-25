import { clerkMiddleware } from '@clerk/express';
import express from 'express';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';


import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
dotenv.config();

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.use(clerkMiddleware())

app.get("/health", (req,res) => {
    res.json({status: "ok", message: "Server is running"});
});

app.use("api/auth", authRoutes);
app.use("api/users", userRoutes);
app.use("api/chats", chatRoutes);
app.use("api/messages", messageRoutes);

app.use(errorHandler); // Global error handler

export default app;