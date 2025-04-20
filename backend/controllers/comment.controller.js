import { errorHandler } from "../utils/error.js";
import Hotel from '../models/hotel.model.js';
import User from "../models/user.model.js";

export const createHotelComment = async (req, res, next) => {
  try {
    const { hotelId, userId, stars, content } = req.body;

    if (!hotelId || !userId || !stars || !content) {
      return next(errorHandler(400, "All fields are required"));
    }

    if (stars < 1 || stars > 5) {
      return next(errorHandler(400, "Rating must be between 1 and 5 stars"));
    }

    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) return next(errorHandler(404, "Hotel not found"));

    const newComment = {
      stars,
      content,
      userId,
      likes: [],
      numberOfLikes: 0,
    };

    hotel.comments.push(newComment);
    hotel.totalRatingStars += stars;

    await hotel.save();

    res.status(201).json({ message: "Comment and rating added successfully", comment: newComment });
  } catch (error) {
    next(errorHandler(500, error.message || "Failed to add comment"));
  }
};

export const getCommentsByHotelId = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ hotelId: req.params.hotelId });
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const populatedComments = await Promise.all(
      hotel.comments.map(async (comment) => {
        const user = await User.findById(comment.userId).select("username");
        return {
          ...comment.toObject(),
          username: user ? user.username : "Unknown",
        };
      })
    );

    res.status(200).json(populatedComments);
  } catch (error) {
    next(error);
  }
};