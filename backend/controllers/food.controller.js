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

export const deleteFood = async (req, res, next) => {
  try {
    const { foodId } = req.params;

    const foodDoc = await Food.findOne({ 'food._id': foodId });

    if (!foodDoc) {
      return next(errorHandler(404, 'Food item not found'));
    }

    foodDoc.food = foodDoc.food.filter(item => item._id.toString() !== foodId);

    await foodDoc.save();

    res.status(200).json({ message: 'Food item deleted successfully' });
  } catch (error) {
    console.error('Delete food error:', error);
    next(errorHandler(500, 'Failed to delete food item'));
  }
};

export const getFoodById = async (req, res, next) => {
  try {
    const { hotelId, foodId } = req.params;

    const hotel = await Food.findOne({ hotelId });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const dish = hotel.food.find(f => f._id.toString() === foodId);

    if (!dish) {
      return res.status(404).json({ message: "Dish not found in the hotel" });
    }

    res.status(200).json({ success: true, dish });
  } catch (err) {
    console.error(err);
    next(errorHandler(500, "Error fetching food"));
  }
};

export const updateFoodById = async (req, res, next) => {
  try {
    const { hotelId, foodId } = req.params;
    const { name, type, category, dishType, price, description, image } = req.body;

    const hotel = await Food.findOne({ hotelId });
    if (!hotel) return next(errorHandler(404, "Hotel not found"));

    const index = hotel.food.findIndex((item) => item._id.toString() === foodId);
    if (index === -1) return next(errorHandler(404, "Food item not found"));

    const originalCreatedAt = hotel.food[index].createdAt;

    hotel.food[index] = {
      ...hotel.food[index]._doc,
      name,
      type,
      category,
      dishType,
      price,
      description,
      image,
      createdAt: originalCreatedAt, 
      updatedAt: new Date(),
    };

    await hotel.save();

    res.status(200).json({ success: true, message: "Food item updated successfully" });
  } catch (err) {
    console.error(err);
    next(errorHandler(500, "Failed to update food item"));
  }
};