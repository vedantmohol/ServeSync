import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async(req,res,next) =>{
    try{
        const {username, phone, email, password} = req.body;

        if(!username || !password || !phone || username.trim()==='' || password.trim()==='' || phone.trim()==='')
        {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ phone });
        if(existingUser){
            return next(errorHandler(400, "User already exists."));
        }
    
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({ 
            username, 
            phone, 
            email : email || null, 
            password : hashedPassword, 
            role: "customer", 
            hotelId: null,
        });
        await newUser.save();
    
        res.status(201).json({ message: "User registered successfully." });

    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

export const signIn = async(req,res,next) =>{
    const {phone, password, staffId, role} = req.body;

    if(!phone || !password || phone.trim() ==="" || password.trim() ===""){
        return next(errorHandler(400,"All fields are required"));
    }

    try{
        const validUser = await User.findOne({phone});
        if(!validUser){
            return next(errorHandler(400,"User not found"));
        }

        const validPassword =  bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(400,"Invalid Password!"));
        }

        if(validUser.role !== "customer"){
            if(!staffId || !role || staffId.trim() ==="" || role.trim() ===""){
                return next(errorHandler(400,"Staff ID and role are required for staff members."));
            }

            if(validUser.hotelId !== staffId || validUser.role !== role){
                return next(errorHandler(400,"Invalid staffId or role"));
            }
        }

        const token = jwt.sign(
            { 
                id: validUser._id, 
                role: validUser.role,
                username: validUser.username,
                email: validUser.email,
                phone: validUser.phone
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        );

        const {password: pass, ...rest} = validUser._doc; 
        res.status(200).cookie('access_token',token,{
            httpOnly: true,
        }).json(rest);

    }catch(error){
        next(error);
    }
}

export const google = async(res,req,next) =>{
    const { email, username, googlePhotoUrl } = req.body;
    try{
        const user = await User.findOne({email});
        if(user){
            const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
            const {password, ...rest} = user._doc;
            res.status(200).cookie('acces_token',token,{
                httpOnly: true,
            }).json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);

            const newUser = new User({
                username: username.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });

            await newUser.save();
            const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET);
            const { password, ...rest} = newUser._doc;

            res.status(200).cookie('access_token',token,{
                httpOnly: true,
            }).json(rest);
        }
    }catch(error){
        next(error);
    }
}