import express from "express";
import { addFood, deleteFood, getFoodById, getFoods, updateFoodById } from "../controllers/food.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/add", verifyToken, addFood);
router.get("/get",getFoods);
router.delete('/delete/:foodId', deleteFood);
router.get('/get/:hotelId/:foodId', getFoodById);
router.patch('/update/:hotelId/:foodId', updateFoodById);

export default router;