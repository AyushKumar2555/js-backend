import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Enable CORS for frontend origin + allow cookies (important for auth)
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Your frontend URL
    credentials: true                // allow cookies / tokens
}));

// Parse incoming JSON with size limit
app.use(express.json({ limit: '16kb' }));

// Parse URL encoded data (form submissions)
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

// Serve static files (images, PDFs, etc.)
app.use(express.static("public"));

// Parse cookies from request header
app.use(cookieParser());

//routes import 
import userRouter from './routes/user.routes.js';

//routes declaration
app.use("/api/v1/users",userRouter)



// http://localhost:8000/api/v1/users/register

export { app };
