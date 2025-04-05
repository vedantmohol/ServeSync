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
    await existingUser.save();

    const { password, ...rest } = existingUser._doc;
    res.status(201).json(rest);

  } catch (error) {
    next(error);
  }
};
