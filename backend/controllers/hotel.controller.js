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

    let assignedKitchen = "";
    if (role === 'chef') {
      if (!hotel.kitchens || hotel.kitchens.length === 0) {
        return next(errorHandler(400, 'No kitchens available to assign to chef.'));
      }

      const chefIndex = hotel.chefs.length;
      assignedKitchen = hotel.kitchens[chefIndex % hotel.kitchens.length];
    }

    const staffInfo = {
      name: user.username,
      email: user.email,
      phone: user.phone,
      staffID: staffID,
      createdAt: new Date(),
    };

    if (role === 'chef') {
      staffInfo.kitchenId = assignedKitchen;
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

export const addHotelStructure = async(req, res, next)=>{
  try{
    const { hotelId, numberOfFloors, floorData, numberOfKitchens } = req.body;

    if(!hotelId || !numberOfFloors || !floorData || !numberOfKitchens){
      return next(errorHandler(400, "All fields are required."));
    }
    
    const hotel = await Hotel.findOne({ hotelId });

    if (!hotel) {
      return next(errorHandler(404, 'Hotel not found'));
    }

    const floorsArray = [];
    for (let i = 0; i < numberOfFloors; i++) {
      const {
        numberOfTables,
        numberOfPremiumTables,
        capacity,
        normalCharges,
        premiumCharges,
      } = floorData[i];
    
      const floorNum = i + 1;
      const floorCode = (floorNum * 100).toString().padStart(3, "0");
      const floorId = `${hotelId}-${floorCode}`;

      const tables = [];

    for (let j = 0; j < numberOfTables; j++) {
      const tableNumber = (floorNum * 100) + j + 1; 
      const tableId = `${hotelId}-${tableNumber.toString().padStart(3, '0')}`;
      const isPremium = j < numberOfPremiumTables ? 'Yes' : 'No';
      const charge = isPremium === 'Yes' ? premiumCharges : normalCharges;

      tables.push({
        tableId,
        isPremium,
        isBooked: 'No',
        capacity,
        charges: charge
      });
    }

    floorsArray.push({
      floorId,
      floorNumber: floorNum,
      tables
    });
    }

    const kitchensArray = [];
    for (let i = 0; i < numberOfKitchens; i++) {
      kitchensArray.push(`KITCHEN-${(i + 1).toString().padStart(3, "0")}`);
    }

    hotel.numberOfFloors = numberOfFloors;
    hotel.floors = floorsArray;
    hotel.numberOfKitchens = numberOfKitchens;
    hotel.kitchens = kitchensArray;

    await hotel.save();
    return res.status(200).json({ message: "Structure added successfully!", hotel });
    
  }catch(error){
    next(errorHandler(500, error.message || 'Something went wrong'));
  }
}

export const getHotelBills = async (req, res, next) => {
  try {
    const phone = req.query.phone?.trim();

    if (!phone) {
      return next(errorHandler(400, "Phone number is required"));
    }

    const hotel = await Hotel.findOne({ phone });

    if (!hotel) {
      return next(errorHandler(404, "Hotel not found with this phone number"));
    }

    const bills = hotel.bills || [];

    const totalAmount = bills.reduce((sum, bill) => sum + bill.subTotal, 0);
    const gstAmount = bills.reduce((sum, bill) => sum + bill.gst + bill.sgst, 0);
    const revenue = bills.reduce((sum, bill) => sum + bill.grandTotal, 0);

    const monthWiseBills = {};

    for (const bill of bills) {
      const createdAt = new Date(bill.createdAt);
      const monthKey = `${createdAt.toLocaleString('default', {
        month: 'long',
      })} ${createdAt.getFullYear()}`;

      if (!monthWiseBills[monthKey]) {
        monthWiseBills[monthKey] = [];
      }

      monthWiseBills[monthKey].push(bill);
    }

    res.status(200).json({
      totalAmount,
      gstAmount,
      revenue,
      bills: monthWiseBills,
    });
  } catch (err) {
    console.error("Error in getHotelBills:", err);
    return next(errorHandler(500, "Server error while fetching hotel bills"));
  }
};

export const getHotelTables = async (req, res, next) => {
  try {
    const { hotelId } = req.query;

    if (!hotelId) return next(errorHandler(400, "Hotel ID is required"));

    const hotel = await Hotel.findOne({ hotelId });

    if (!hotel) return next(errorHandler(404, "Hotel not found"));

    res.status(200).json({
      success: true,
      hotelName: hotel.hotelName,
      hotelPhoto: hotel.hotelPhoto,
      hotelAddress: hotel.hotelAddress,
      hotelType: hotel.hotelType,
      phone: hotel.phone,
      floors: hotel.floors,
    });
  } catch (err) {
    next(errorHandler(500, err.message || "Failed to fetch table structure"));
  }
};

export const getAvailableWaiters = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ hotelId: req.query.hotelId });
    if (!hotel) return next(errorHandler(404, "Hotel not found"));

    const waiters = hotel.waiters.filter((w) => w.isAvailable === "Yes");
    res.status(200).json({ success: true, waiters });
  } catch (err) {
    next(errorHandler(500, err.message || "Failed to fetch waiters"));
  }
};

export const getHotelStaff = async (req, res, next) => {
  try {
    const { hotelId } = req.query;

    if (!hotelId) {
      return res.status(400).json({ success: false, message: "Hotel ID required" });
    }

    const hotel = await Hotel.findOne({ hotelId });

    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    res.status(200).json({
      success: true,
      numberOfChefs: hotel.numberOfChefs || hotel.chefs.length,
      numberOfWaiters: hotel.numberOfWaiters || hotel.waiters.length,
      numberOfHallManagers: hotel.numberOfHallManagers || hotel.hallManagers.length,
      chefs: hotel.chefs || [],
      waiters: hotel.waiters || [],
      hallManagers: hotel.hallManagers || [],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStaff = async (req, res, next) => {
  try {
    const { phone, role, hotelId } = req.body;

    if (!phone || !role || !hotelId) {
      return res.status(400).json({ message: "Missing phone, role or hotelId" });
    }
    
    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (role === "chef") {
      hotel.chefs = hotel.chefs.filter(staff => staff.phone !== phone);
      hotel.numberOfChefs = hotel.chefs.length;
    } else if (role === "waiter") {
      hotel.waiters = hotel.waiters.filter(staff => staff.phone !== phone);
      hotel.numberOfWaiters = hotel.waiters.length;
    } else if (role === "hall_manager") {
      hotel.hallManagers = hotel.hallManagers.filter(staff => staff.phone !== phone);
      hotel.numberOfHallManagers = hotel.hallManagers.length;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }    

    await hotel.save();


    user.role = "customer";
    user.staffId = null;
    user.hotelId = null;
    await user.save();

    return res.status(200).json({ success: true, message: `${role} removed successfully` });
  } catch (error) {
    return next(errorHandler(500, error.message || "Failed to remove staff"));
  }
};

export const updateStaff = async (req, res, next) => {
  try {
    const { username, email, phone, role, hotelId, staffID } = req.body;

    if (!username || !email || !phone || !role || !hotelId) {
      return next(errorHandler(400, "All fields are required"));
    }

    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) return next(errorHandler(404, "Hotel not found"));

    const staffListKey = {
      chef: "chefs",
      waiter: "waiters",
      hall_manager: "hallManagers",
    }[role];

    const staffList = hotel[staffListKey];
    const staffIndex = staffList.findIndex((s) => s.staffID === staffID);

    if (staffIndex === -1) {
      return next(errorHandler(404, "Staff not found"));
    }

    hotel[staffListKey][staffIndex].name = username;
    hotel[staffListKey][staffIndex].email = email;
    hotel[staffListKey][staffIndex].phone = phone;

    await hotel.save();

    res.status(200).json({ success: true, message: "Staff updated successfully" });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
