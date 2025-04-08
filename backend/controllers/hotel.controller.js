import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Hotel from "../models/hotel.model.js";

export const registerHotel = async (req, res, next) => {
  try {
    const { adminName, phone, adminEmail, hotelName, hotelType, hotelAddress, hotelPassword } = req.body;
    if (
      !adminName ||
      !phone ||
      !adminEmail ||
      !hotelName ||
      !hotelType ||
      !hotelAddress ||
      !hotelPassword
    ) {
      return next(errorHandler(400, "All fields are required."));
    }

    const existingHotel = await Hotel.findOne({ phone, adminEmail });
    if (existingHotel) {
      return next(errorHandler(400, "Register using other email."));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(hotelPassword, salt);

    const newHotel = new Hotel({
        adminName: adminName.trim(),
        phone,
        adminEmail,
        hotelName: hotelName.trim(),
        hotelType,
        hotelAddress,
        hotelPassword: hashedPassword,
      });

    await newHotel.save();

    const existingUser = await User.findOne({ phone });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    existingUser.role = "hotel_admin";
    existingUser.hotelId = newHotel.hotelId;
    await existingUser.save();

    const { password, ...rest } = existingUser._doc;
    res.status(201).json(rest);

  } catch (error) {
    next(error);
  }
};

export const getHotels = async (req, res, next) =>{
  try{
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const sortBy = req.query.sortBy || 'createdAt';

    const filter = {};

    if (req.query.hotelName) {
      filter.hotelName = { $regex: req.query.hotelName, $options: 'i' };
    }

    if (req.query.hotelType) {
      filter.hotelType = req.query.hotelType;
    }

    if (req.query.hotelAddress) {
      filter.hotelAddress = { $regex: req.query.hotelAddress, $options: 'i' };
    }

    const hotels = await Hotel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .select('-hotelPassword');

      const totalHotels = await Hotel.countDocuments(filter);
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentHotels = await Hotel.countDocuments({
        ...filter,
        createdAt: { $gte: oneWeekAgo },
      });

      res.status(200).json({
        hotels,
        totalHotels,
        recentHotels,
      });
  }catch(error){
    next(errorHandler(500, 'Failed to fetch hotels'));
  }
}