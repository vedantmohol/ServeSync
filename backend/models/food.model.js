import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dishType: {
    type: String,
    enum: ["Veg", "Nonveg"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTne9zFARFBv8s504Akf4-Bdj2Dx6XIBWFHYQ&s"
  },
},{timestamps: true});

const foodSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
  },
  hotelId: {
    type: String,
    required: true,
    unique: true,
  },
  hotelType: {
    type: String,
    required: true,
  },
  adminEmail: {
    type: String,
    required: true,
  },
  hotelAddress: {
    type: String,
    required: true,
  },
  food: [foodItemSchema],
});

export default mongoose.model("Food", foodSchema);
