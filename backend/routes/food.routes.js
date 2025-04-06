import express from "express";
import { addFood } from "../controllers/food.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, addFood);

export default router;