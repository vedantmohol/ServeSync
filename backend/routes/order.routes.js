import express from "express";
import { getOrderStructure, placeOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/getStructure",getOrderStructure);
router.post("/placeOrder",placeOrder);

export default router;