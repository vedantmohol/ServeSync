import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';

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

app.use("/api/auth",authRoutes)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});