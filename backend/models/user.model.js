import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: null,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["chef","waiter","customer","hotel_admin","hall_manager"],
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    hotelId: { 
        type: String, 
        ref: "Hotel", 
        required: function(){ 
            return this.role !== "customer";
        } 
    },
    profilePicture: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    }
},{timestamps: true}
);

const User = mongoose.model('User',userSchema);
export default User;