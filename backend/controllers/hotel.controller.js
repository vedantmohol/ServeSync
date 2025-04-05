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

    await User.findOneAndUpdate({ phone }, { role: "admin" });
    res.status(201).json({ message: "Hotel registered successfully." });

  } catch (error) {
    next(error);
  }
};
