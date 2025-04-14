import Hotel from "../models/hotel.model.js";
import { errorHandler } from "../utils/error.js";

export const getOrderStructure = async (req, res, next) =>{
    try{
        const { hotelId } = req.query;

        if (!hotelId) {
            return next(errorHandler(400, "Hotel ID is required."));
          }
      
          const hotel = await Hotel.findOne({ hotelId });
      
          if (!hotel) {
            return next(errorHandler(404, "Hotel not found."));
          }
      
          const responseData = {
            floors: hotel.floors || [],
            kitchens: hotel.kitchens || []
          };
      
          return res.status(200).json(responseData);       
    }catch(error){
        next(errorHandler(500, error.message || "Something went wrong while fetching structure"));
    }
}