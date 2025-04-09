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

export const getFoods = async (req, res, next) => {
  try{
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const sortBy = req.query.sortBy || 'createdAt';
    
    const filter = {};

    if (req.query.hotelName) {
      filter.hotelName = { $regex: req.query.hotelName, $options: 'i' };
    }

    if (req.query.foodName) {
      filter['food.name'] = { $regex: req.query.foodName, $options: 'i' };
    }

    if (req.query.hotelId) {
      filter.hotelId = req.query.hotelId; 
    }

    if (req.query.dishType) {
      filter['food.dishType'] = req.query.dishType;
    }

    if (req.query.category) {
      filter['food.category'] = req.query.category;
    }

    const foods = await Food.aggregate([
      { $unwind: '$food' },
      { $match: filter },
      {
        $sort: {
          [`food.${sortBy === 'price' ? 'price' : 'createdAt'}`]: sortDirection,
        },
      },
      { $skip: startIndex },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          hotelName: 1,
          hotelAddress: 1,
          adminEmail: 1,
          food: 1,
        },
      },
    ]);

    const totalFoods = await Food.aggregate([
      { $unwind: '$food' },
      { $match: filter },
      { $count: 'count' },
    ]);

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentFoods = await Food.aggregate([
      { $unwind: '$food' },
      { $match: { ...filter, 'food.createdAt': { $gte: oneWeekAgo } } },
      { $count: 'count' },
    ]);

    res.status(200).json({
      foods,
      totalFoods: totalFoods[0]?.count || 0,
      recentFoods: recentFoods[0]?.count || 0,
    });
  }catch(error){
    next(errorHandler(500, 'Failed to fetch foods'));
  }
}