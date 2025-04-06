import Food from "../models/food.model.js";
import Hotel from "../models/hotel.model.js";
import { errorHandler } from "../utils/error.js";

export const addFood = async (req, res, next) => {
  try {
    const { hotelId, food } = req.body;

    if (!hotelId || !Array.isArray(food) || food.length === 0) {
      return next(errorHandler(400, "hotelId and food array are required"));
    }

    for (const item of food) {
      const { name, type, category, description, dishType, price, image } = item;
      if (
        !name || !type || !category || !description ||
        !dishType || !price || !image
      ) {
        return next(errorHandler(400, "All food fields are required for each item"));
      }
    }

    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) {
      return next(errorHandler(404, "Hotel not found with the provided hotelId"));
    }

    const { hotelName, hotelType, adminEmail, hotelAddress } = hotel;

    let existingHotelInFoodModel = await Food.findOne({ hotelId });

    if (existingHotelInFoodModel) {
      existingHotelInFoodModel.food.push(...food);
      await existingHotelInFoodModel.save();
      res.status(200).json({
        message: "Food items added successfully to existing hotel",
      });
    } else {
      const newHotelFood = new Food({
        hotelName,
        hotelId,
        hotelType,
        adminEmail,
        hotelAddress,
        food,
      });

      await newHotelFood.save();
      res.status(201).json({
        message: "Hotel created and food items added successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};