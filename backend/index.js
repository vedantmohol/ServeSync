import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import customerRoutes from './routes/customer.routes.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

mongoose.connect(process.env.mongoDB_url)
.then(
    ()=>{
        console.log("Connected to MongoDB");
    }
).catch((err)=>{
    console.log("Error connecting to database: ",err);
})

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/customer',customerRoutes);
app.use("/api/auth",authRoutes);

app.use((err,req,res,next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});