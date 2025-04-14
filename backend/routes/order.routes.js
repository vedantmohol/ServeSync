import express from "express";
import { getOrderStructure } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/getStructure",getOrderStructure);

export default router;