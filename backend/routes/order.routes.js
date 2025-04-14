import express from "express";
import { getManagerOrders, getOrderStructure, placeOrder, updateOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/getStructure",getOrderStructure);
router.post("/placeOrder",placeOrder);
router.get("/getManagerOrders",getManagerOrders);
router.patch("/updateOrder", updateOrder);

export default router;