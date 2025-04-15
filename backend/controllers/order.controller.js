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

  export const updateOrder = async (req, res, next) => {
    try {
      const { hotelId, orderId, items } = req.body;
  
      if (!hotelId || !orderId || !items || !Array.isArray(items)) {
        return next(errorHandler(400, "Required fields are missing or invalid."));
      }
  
      const hotel = await Hotel.findOne({ hotelId });
      if (!hotel) {
        return next(errorHandler(404, "Hotel not found."));
      }
  
      const orderIndex = hotel.orders.findIndex(
        (order) => order._id.toString() === orderId
      );
  
      if (orderIndex === -1) {
        return next(errorHandler(404, "Order not found."));
      }
  
      const existingOrder = hotel.orders[orderIndex];
  
      items.forEach((newItem) => {
        const existingItem = existingOrder.items.find(
          (item) => item.foodName === newItem.foodName
        );
  
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
          existingItem.amount += newItem.quantity * newItem.price;
        } else {
          existingOrder.items.push({
            foodName: newItem.foodName,
            quantity: newItem.quantity,
            amount: newItem.quantity * newItem.price,
          });
        }
      });
  
      existingOrder.totalAmount = existingOrder.items.reduce(
        (sum, item) => sum + item.amount,
        0
      );
  
      await hotel.save();
  
      return res.status(200).json({ message: "Order updated successfully", updatedOrder: existingOrder });
    } catch (error) {
      next(errorHandler(500, error.message || "Failed to update the order"));
    }
  };

export const getChefOrders = async (req, res, next) => {
  try {
    const { hotelId, staffId } = req.query;

    if (!hotelId || !staffId) {
      return next(errorHandler(400, "Hotel ID and Staff ID are required."));
    }

    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) return next(errorHandler(404, "Hotel not found."));

    const chef = hotel.chefs.find((c) => c.staffID === staffId);
    if (!chef) return next(errorHandler(404, "Chef not found in this hotel."));

    const kitchenId = chef.kitchenId;
    if (!kitchenId) return next(errorHandler(400, "No kitchen assigned to this chef."));

    const chefOrders = hotel.orders?.filter((order) => order.kitchenId === kitchenId) || [];

    res.status(200).json({ orders: chefOrders });
  } catch (error) {
    next(errorHandler(500, error.message || "Failed to fetch chef's orders"));
  }
};

export const markOrderCompleted = async (req, res, next) => {
  try {
    const { hotelId, orderId } = req.body;

    if (!hotelId || !orderId) {
      return next(errorHandler(400, "Hotel ID and Order ID are required"));
    }

    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) {
      return next(errorHandler(404, "Hotel not found"));
    }

    const order = hotel.orders.id(orderId);
    if (!order) {
      return next(errorHandler(404, "Order not found"));
    }

    order.items = order.items.map(item => ({
      ...item,
      quantity: 0
    }));

    await hotel.save();
    res.status(200).json({ message: "Order marked as completed", order });
  } catch (error) {
    next(errorHandler(500, error.message || "Failed to mark order as completed"));
  }
};
