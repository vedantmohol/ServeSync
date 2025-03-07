import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
// import jwt from "jsonwebtoken";

export const signUp = async(req,res) =>{
    try{
        const {username, phone, email, password} = req.body;

        if(!username || !password || !phone || username==='' || password==='' || phone==='')
        {
            return next(errorHandler(400,'All fields are required'));
        }

        const existingUser = await User.findOne({ phone });
        if(existingUser){
            return next(errorHandler(400, "User already exists."));
        }
    
        const newUser = new User({ 
            username, 
            phone, 
            email : email || null, 
            password, 
            role: "customer", 
            hotelId: null,
        });
        await newUser.save();
    
        res.status(201).json({ message: "User registered successfully." });

    }catch(error){
        next(errorHandler(500, "Internal Server Error."));
    }
}