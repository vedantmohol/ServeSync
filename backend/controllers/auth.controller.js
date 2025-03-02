import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

export const signUp = async(req,res) =>{
    try{
        const {username, email, password, role, phone, hotelId} = req.body;

        if(role !== "customer" && !hotelId){
            return res.status(400).json({message: "Hotel ID is required for staff roles"});
        }

        if(!username || !email || !password || !phone || username==='' || email==='' || password==='' || phone==='')
        {
            return res.status(400).json({message: 'All fields are required'});
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "User already exists." });
        }
    
        const newUser = new User({ 
            username, 
            email, 
            password, 
            phone, 
            role, 
            hotelId: role === "customer" ? null : hotelId 
        });
        await newUser.save();
    
        res.status(201).json({ message: "User registered successfully." });

    }catch(error){
        res.status(500).json({ message: "Internal Server Error." });
    }
}