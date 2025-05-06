import Hotel from "../models/hotel.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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


export const generateBill = async (req, res, next) => {
  try {
    const { hotelId, orderId, paymentMode } = req.body;

    if (!hotelId || !orderId || !paymentMode) {
      return next(errorHandler(400, "Hotel ID, Order ID, and payment mode are required."));
    }

    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) return next(errorHandler(404, "Hotel not found."));

    const orderIndex = hotel.orders.findIndex(order => order._id.toString() === orderId);
    if (orderIndex === -1) {
      return next(errorHandler(404, "Order not found."));
    }

    const order = hotel.orders[orderIndex];
    const subTotal = order.totalAmount;

    const totalStaff =
      hotel.numberOfChefs + hotel.numberOfWaiters + hotel.numberOfHallManagers;

    let gstRate = 2.5;
    if (totalStaff > 10) gstRate = 12.0;
    else if (totalStaff > 5) gstRate = 5.0;

    const gstAmount = Math.round((gstRate / 100) * subTotal);
    const grandTotal = Math.round(subTotal + 2 * gstAmount);

    const lastBill = hotel.bills?.at(-1)?.billNo;
    const lastNum = lastBill ? parseInt(lastBill.split("-")[1]) : 109999;
    const nextNum = String(lastNum + 1).padStart(6, "0");
    const billNo = `${hotelId}-${nextNum}`;

    const newBill = {
      billNo,
      createdAt: new Date(),
      subTotal,
      gst: gstAmount,
      sgst: gstAmount,
      grandTotal,
      paymentMode,
    };

    hotel.bills.push(newBill);

    if (
      !hotel.totalRevenue ||
      typeof hotel.totalRevenue.totalAmount !== "number" ||
      typeof hotel.totalRevenue.gstAmount !== "number" ||
      typeof hotel.totalRevenue.revenue !== "number"
    ) {
      hotel.totalRevenue = {
        totalAmount: 0,
        gstAmount: 0,
        revenue: 0,
      };
    }

    hotel.totalRevenue.totalAmount += subTotal;
    hotel.totalRevenue.gstAmount += 2 * gstAmount;
    hotel.totalRevenue.revenue += grandTotal;

    hotel.orders.splice(orderIndex, 1);

    const floor = hotel.floors.find((f) => f.floorId === order.floorId);
    if (floor) {
      const table = floor.tables.find((t) => t.tableId === order.tableId);
      if(table){
        table.isBooked = "No";
      }
    }
    
    await hotel.save();

    res.status(200).json({
      message: "Bill generated successfully",
      billNo,
      subTotal,
      gst: gstAmount,
      sgst: gstAmount,
      grandTotal,
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Failed to generate bill."));
  }
};

export const createRazorpayOrder = async (req, res, next) => {
  const { amount } = req.body; 

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const placeOnlineOrder = async (req, res, next) => {
  try {
    const { adminEmail, items, userEmail, paymentMethod } = req.body;

    if (!adminEmail || !Array.isArray(items) || items.length === 0 || !userEmail) {
      return next(errorHandler(400, "Admin email, food items, and user email are required."));
    }

    const hotel = await Hotel.findOne({ adminEmail });
    if (!hotel) return next(errorHandler(404, "Hotel not found."));

    const customer = await User.findOne({ email: userEmail });
    if (!customer) return next(errorHandler(404, "Customer not found."));

    const staffId = hotel.hallManagers?.[0]?.staffID;
    if (!staffId) return next(errorHandler(404, "No hall manager assigned."));

    const kitchenId = hotel.kitchens?.[0] || "Online";

    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const amount = item.price * item.quantity;
      totalAmount += amount;
      return {
        foodName: item.foodName,
        quantity: item.quantity,
        amount,
      };
    });

    const totalStaff = hotel.numberOfChefs + hotel.numberOfWaiters + hotel.numberOfHallManagers;

    let gstRate = 2.5;
    if (totalStaff > 10) gstRate = 12.0;
    else if (totalStaff > 5) gstRate = 5.0;

    const gstAmount = (gstRate / 100) * totalAmount;
    const grandTotal = Math.round(totalAmount + 2 * gstAmount);

    const now = new Date();
    const estimatedTime = items.length > 3 ? 45 : 30;

    if (paymentMethod === "UPI") {
      const Razorpay = require("razorpay");

      const razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: grandTotal * 100,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };

      const razorpayOrder = await razorpayInstance.orders.create(options);

      return res.status(200).json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        estimatedTime,
      });
    }

    const hotelOrder = {
      staffId,
      floorId: null,
      tableId: null,
      kitchenId,
      items: orderItems,
      totalAmount: grandTotal,
      orderType: "Online",
      createdAt: now,
    };

    const userOrder = {
      restaurantName: hotel.hotelName,
      createdAt: now,
      items: orderItems,
      amount: grandTotal,
    };

    hotel.orders.push(hotelOrder);
    await hotel.save();

    customer.orders.push(userOrder);
    await customer.save();

    res.status(200).json({
      success: true,
      message: `Order placed successfully! Expected in ${estimatedTime} minutes.`,
      estimatedTime,
    });
  } catch (error) {
    next(errorHandler(500, error.message || "Failed to place online order."));
  }
};

export const bookTable = async (req, res, next) => {
  try {
    const { hotelName, floorId, tableId, date, time, phone, username } = req.body;

    if (!hotelName || !floorId || !tableId || !date || !time || !phone || !username){
      return next(errorHandler(400, "All booking fields are required"));
    }

    const hotel = await Hotel.findOne({ hotelName });

    if (!hotel) return next(errorHandler(404, "Hotel not found"));

    const floor = hotel.floors.find(f => f.floorId === floorId);
    if (!floor) return next(errorHandler(404, "Floor not found"));

    const table = floor.tables.find(t => t.tableId === tableId);
    if (!table) return next(errorHandler(404, "Table not found"));

    if (table.isBooked === "Yes") {
      return next(errorHandler(400, "Table is already booked"));
    }

    table.isBooked = "Yes";
    table.date = date;
    table.time = time;
    table.phone = phone;
    table.username = username;

    await hotel.save();

    res.status(200).json({
      message: "Table booked successfully",
      updatedTable: table,
    });

  } catch (error) {
    next(errorHandler(500, error.message || "Failed to book table"));
  }
};

export const unbookTable = async (req, res, next) => {
  try {
    const { hotelId, floorId, tableId } = req.body;

    if (!hotelId || !floorId || !tableId) {
      return next(errorHandler(400, "Missing required parameters"));
    }

    const hotel = await Hotel.findOne({ hotelId });

    if (!hotel) return next(errorHandler(404, "Hotel not found"));

    const floor = hotel.floors.find((f) => f.floorId === floorId);
    if (!floor) return next(errorHandler(404, "Floor not found"));

    const table = floor.tables.find((t) => t.tableId === tableId);
    if (!table) return next(errorHandler(404, "Table not found"));

    table.isBooked = "No";
    table.date = null;
    table.time = null;
    table.phone = null;
    table.username = null;

    await hotel.save();

    res.status(200).json({
      success: true,
      message: "Table unbooked successfully",
      updatedTable: table,
    });
  } catch (err) {
    next(errorHandler(500, err.message || "Failed to unbook table"));
  }
};

export const getOrderHistory = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) return next(errorHandler(400, "Email is required"));

    const user = await User.findOne({ email });

    if (!user || !user.orders || user.orders.length === 0) {
      return res.status(200).json({ orders: [] });
    }

    const sortedOrders = user.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ orders: sortedOrders });

  } catch (err) {
    next(errorHandler(500, err.message || "Failed to fetch order history"));
  }
};

export const assignWaiterToOrder = async (req, res, next) => {
  try {
    const { hotelId, orderId, waiterId } = req.body;
    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) return next(errorHandler(404, "Hotel not found"));

    const order = hotel.orders.id(orderId);
    if (!order) return next(errorHandler(404, "Order not found"));

    const waiter = hotel.waiters.find((w) => w.staffID === waiterId);
    if (!waiter) return next(errorHandler(404, "Waiter not found"));

    waiter.isAvailable = "No";
    order.waiterId = waiterId;
    await hotel.save();

    res.status(200).json({ success: true, message: "Waiter assigned successfully" });
  } catch (err) {
    next(errorHandler(500, err.message || "Failed to assign waiter"));
  }
};

export const getWaiterOrders = async (req, res, next) => {
  try {
    const { hotelId, staffId } = req.query;
    if (!hotelId || !staffId) {
      return next(errorHandler(400, "Missing hotelId or staffId"));
    }

    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) return next(errorHandler(404, "Hotel not found"));

    const orders = hotel.orders.filter(
      (order) => order.waiterId === staffId && order.status === "pending"
    );

    res.status(200).json({ orders });
  } catch (err) {
    next(errorHandler(500, err.message));
  }
};

export const updateOrderDelivery = async (req, res, next) => {
  try {
    const { hotelId, orderId } = req.body;
    const hotel = await Hotel.findOne({ hotelId });
    if (!hotel) return next(errorHandler(404, "Hotel not found"));

    const order = hotel.orders.id(orderId);
    if (!order) return next(errorHandler(404, "Order not found"));

    const waiter = hotel.waiters.find((w) => w.staffID === order.waiterId);
    if (waiter) waiter.isAvailable = "Yes";

    order.status = "delivered";
    await hotel.save();

    res.status(200).json({ success: true, message: "Order marked as delivered" });
  } catch (err) {
    next(errorHandler(500, err.message || "Failed to update delivery"));
  }
};