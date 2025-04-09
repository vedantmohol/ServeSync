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

export const addStaff = async(req,res,next) =>{
  try{
    const {username, email, phone, role, hotelId } = req.body;
    const validRoles = ['chef', 'waiter', 'hall_manager'];

    if(!username || !email || !phone || !role) {
      return next(errorHandler(500,"All fields required!"))
    }

    if (!validRoles.includes(role)) {
      return next(errorHandler(400, 'Invalid role selected'));
    }
    
    const user = await User.findOne({email});

    if (!user) {
      return next(errorHandler(404, 'User does not exist with given email and phone'));
    }

    if (user.role !== 'customer') {
      return next(errorHandler(403, 'User is already a staff member'));
    }

    const hotel = await Hotel.findOne({ hotelId });
    
    if (!hotel) {
      return next(errorHandler(404, 'Hotel not found'));
    }

    let base = 100;
    let letter = '';
    let existingList = [];

    if (role === 'chef') {
      base = 100;
      letter = 'C';
      existingList = hotel.chefs || [];
    } else if (role === 'hall_manager') {
      base = 300;
      letter = 'H';
      existingList = hotel.hallManagers || [];
    } else if (role === 'waiter') {
      base = 500;
      letter = 'W';
      existingList = hotel.waiters || [];
    }

    let usedNumbers = existingList.map((s) => {
      const match = s.staffID.match(/-(\d+)[A-Z]$/);
      return match ? parseInt(match[1], 10) : null;
    }).filter(Boolean);

    let nextNumber = base + 1;
    while (usedNumbers.includes(nextNumber)) {
      nextNumber++;
    }

    if (role === 'chef' && nextNumber > 299) {
      return next(errorHandler(400, 'Chef limit reached (max 199)'));
    }
    if (role === 'hall_manager' && nextNumber > 499) {
      return next(errorHandler(400, 'Hall Manager limit reached (max 199)'));
    }
    if (role === 'waiter' && nextNumber > 999) {
      return next(errorHandler(400, 'Waiter limit reached (max 499)'));
    }

    const staffID = `${hotel.hotelId}-${nextNumber}${letter}`;

    user.role = role;
    user.hotelId = hotel.hotelId;
    user.staffId = staffID;
    await user.save();

    const staffInfo = {
      name: user.username,
      email: user.email,
      phone: user.phone,
      staffID: staffID,
      createdAt: new Date(),
    };

    if (role === 'chef') {
      hotel.chefs.push(staffInfo);
      hotel.numberOfChefs += 1;
    } else if (role === 'hall_manager') {
      hotel.hallManagers.push(staffInfo);
      hotel.numberOfHallManagers += 1;
    } else if (role === 'waiter') {
      hotel.waiters.push(staffInfo);
      hotel.numberOfWaiters += 1;
    }

    await hotel.save();

    res.status(200).json({ message: 'Staff added successfully', staffID });
  } catch (err) {
    next(errorHandler(500, err.message || 'Failed to add staff'));
  }
};