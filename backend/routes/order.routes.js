import express from "express";
import { bookTable, generateBill, getChefOrders, getManagerOrders, getOrderStructure, markOrderCompleted, placeOnlineOrder, placeOrder, updateOrder } from "../controllers/order.controller.js";

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

export default router;