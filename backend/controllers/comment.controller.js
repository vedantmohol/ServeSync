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

export const editComment = async (req, res, next) => {
  try {
    const { content, stars } = req.body;
    const { commentId } = req.params;
    const userId = req.user.id;

    const hotel = await Hotel.findOne({ 'comments._id': commentId });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    const comment = hotel.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const oldStars = comment.stars;
    if (typeof stars === 'number' && stars >= 1 && stars <= 5) {
      hotel.totalRatingStars = hotel.totalRatingStars - oldStars + stars;
      comment.stars = stars;
    }

    if (content) {
      comment.content = content;
    }

    await hotel.save();
    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userPhone = req.user.phone;

    const user = await User.findOne({ phone: userPhone });
    if (!user) return res.status(404).json({ message: 'User not found' });


    const hotel = await Hotel.findOne({ 'comments._id': commentId });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    const comment = hotel.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    hotel.totalRatingStars -= comment.stars;
    hotel.comments.pull({ _id: commentId });

    await hotel.save();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};