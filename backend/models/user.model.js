import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["chef","waiter","customer","hotel_admin","hall_manager"],
        required: true,
    },
    phone:{
        type: number,
        required: true,
        unique: true,
    },
},{timestamps: true}
);

const User = mongoose.model('User',userSchema);

export default User;