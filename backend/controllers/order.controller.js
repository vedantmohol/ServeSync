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

export const placeOrder = async(req,res,next)=>{
    try{
        const { hotelId, staffId, floorId, tableId, kitchenId, items } = req.body;

        if (!hotelId || !staffId || !floorId || !tableId || !kitchenId || !items || !items.length) {
            return next(errorHandler(400, "All fields are required"));
        }

        const hotel = await Hotel.findOne({ hotelId });

        if(!hotel){ 
            return next(errorHandler(404, "Hotel not found"));
        }
        
        let totalAmount = 0;
        const orderItems = items.map((item) => {
          const itemTotal = item.price * item.quantity;
          totalAmount += itemTotal;
          return {
            foodName: item.foodName,
            quantity: item.quantity,
            price: item.price,
            amount: itemTotal,
          };
        });

        const order = {
            staffId,
            floorId,
            tableId,
            kitchenId,
            items: orderItems,
            totalAmount,
            createdAt: new Date()
        };

        if (!hotel.orders) hotel.orders = [];
        hotel.orders.push(order);

        const floor = hotel.floors.find((f) => f.floorId === floorId);
        if (!floor) return next(errorHandler(404, "Floor not found"));

        const table = floor.tables.find((t) => t.tableId === tableId);
        if (!table) return next(errorHandler(404, "Table not found"));

        table.isBooked = "Yes";

        await hotel.save();

        return res.status(200).json({
            success: true,
            message: "Order placed successfully!",
            order
          });      
    }catch(error){
        next(errorHandler(500, error.message || "Failed to place order"));
    }
}

export const getManagerOrders = async (req, res, next) => {
    try {
      const { hotelId, staffId } = req.query;
  
      if (!hotelId || !staffId) {
        return next(errorHandler(400, "Hotel ID and Staff ID are required."));
      }
  
      const hotel = await Hotel.findOne({ hotelId });
      if (!hotel) return next(errorHandler(404, "Hotel not found."));
  
      const managerOrders = (hotel.orders || []).filter(
        (order) => order.staffId === staffId
      );
  
      res.status(200).json({ orders: managerOrders });
    } catch (error) {
      next(errorHandler(500, error.message || "Failed to fetch manager orders"));
    }
  };