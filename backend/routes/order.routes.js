import express from "express";
import { generateBill, getChefOrders, getManagerOrders, getOrderStructure, markOrderCompleted, placeOrder, updateOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/getStructure",getOrderStructure);
router.post("/placeOrder",placeOrder);
router.get("/getManagerOrders",getManagerOrders);
router.patch("/updateOrder", updateOrder);
router.get("/getChefOrders", getChefOrders);
router.patch("/markCompleted", markOrderCompleted);
router.post("/generateBill",generateBill);

export default router;