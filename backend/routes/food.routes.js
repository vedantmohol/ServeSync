import express from "express";
import { addFood, getFoods } from "../controllers/food.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, addFood);
router.get("/get",getFoods);

export default router;