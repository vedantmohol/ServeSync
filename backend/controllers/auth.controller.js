import User from "../models/user.model.js";
import Hotel from "../models/hotel.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async(req,res,next) =>{
    const {username, phone, email, password} = req.body;

    if(!username || !password || !phone || !email || username ==='' ||  phone ==='' || email ==='' || password ==='' )
    {
        next(errorHandler(400,'All fields are required'));
    }

    const existingUser = await User.findOne({ email });
    if(existingUser){
        next(errorHandler(400, "User already exists."));
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({ 
        username, 
        phone, 
        email,
        password : hashedPassword, 
        role: "customer", 
        hotelId: null,
    });
    
    try{
        await newUser.save();
        res.json("User registered successfully.");
    }catch(error){
        next(error);
    }
}

export const signIn = async(req,res,next) =>{
    const {phone,email, password, staffId, adminEmail, hotelId, role} = req.body;

    if(!phone || !password || phone.trim() ==="" || password.trim() ===""){
        return next(errorHandler(400,"All fields are required"));
    }

    try{
        const validUser = await User.findOne({phone});
        if(!validUser){
            return next(errorHandler(400,"User not found"));
        }

        if (validUser.role !== role) {
            return next(errorHandler(400, "Incorrect role selected"));
        }

        const validPassword =  bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(400,"Invalid Password!"));
        }

        if (role === "hotel_admin") {
            if (!hotelId || hotelId.trim() === "") {
              return next(errorHandler(400, "Hotel ID is required for hotel admins"));
            }
            if (!adminEmail || adminEmail.trim() === "") {
                return next(errorHandler(400, "Admin Email is required for hotel admins"));
            }

            const hotel = await Hotel.findOne({ adminEmail });
            if (hotel.hotelId !== hotelId) {
              return next(errorHandler(400, "Invalid Hotel ID"));
            }
            if (hotel.adminEmail !== adminEmail) {
                return next(errorHandler(400, "Admin Email does not match"));
            }
            if (hotel.phone !== validUser.phone) {
                return next(errorHandler(400, "Phone mismatch between user and hotel admin"));
            }
        }

        if(validUser.role !== "customer" && validUser.role !== "hotel_admin"){
            if(!staffId || !role || staffId.trim() ==="" || role.trim() ===""){
                return next(errorHandler(400,"Staff ID and role are required for staff members."));
            }

            if(validUser.staffId !== staffId){
                return next(errorHandler(400,"Invalid staffId"));
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