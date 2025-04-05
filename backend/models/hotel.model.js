import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true,
    },
    adminPhone: {
        type: String,
        required: true,
    },
    hotelName: {
        type: String,
        required: true,
    },
    hotelAddress: {
        type: String,
        required: true,
    },
    hotelPassword: {
        type: String,
        required: true,
    },
    hotelPhoto: {
        type: String,
        default: "https://iadairport.com/images/default-resturant.jpg",
    },
    numberOfChefs: {
        type: Number,
        default: 0,
    },
    numberOfWaiters: {
        type: Number,
        default: 0,
    },
    numberOfHallManagers: {
        type: Number,
        default: 0,
    },
    hotelId: {
        type: String,
        unique: true,
        default: () =>{
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            const shortId = Array.from({ length: 2 }, () =>
                letters.charAt(Math.floor(Math.random() * letters.length))
              ).join('');
            return `${yyyy}${mm}${dd}${shortId}`;
        },
    },
});

const Hotel = mongoose.model("Hotel",hotelSchema);
export default Hotel;