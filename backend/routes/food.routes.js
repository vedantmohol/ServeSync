import express from "express";
import { addFood, deleteFood, getFoods } from "../controllers/food.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, addFood);
router.get("/get",getFoods);
router.delete('/delete/:foodId', deleteFood);

export default router;