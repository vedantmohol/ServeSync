import express from "express";
import { assignWaiterToOrder, bookTable, generateBill, getChefOrders, getManagerOrders, getOrderHistory, getOrderStructure, getWaiterOrders, markOrderCompleted, placeOnlineOrder, placeOrder, unbookTable, updateOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/getStructure",getOrderStructure);
router.post("/placeOrder",placeOrder);
router.get("/getManagerOrders",getManagerOrders);
router.patch("/updateOrder", updateOrder);
router.get("/getChefOrders", getChefOrders);
router.patch("/markCompleted", markOrderCompleted);
router.post("/generateBill",generateBill);
router.post("/place-online", placeOnlineOrder);
router.put("/bookTable",bookTable);
router.put("/unbookTable", unbookTable);
router.get("/orderhistory", getOrderHistory);
router.patch("/assign-waiter", assignWaiterToOrder);
router.get("/get-waiter-orders", getWaiterOrders);

export default router;