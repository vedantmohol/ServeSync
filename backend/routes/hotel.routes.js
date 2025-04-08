import express from "express";
import { getHotels, registerHotel } from "../controllers/hotel.controller.js";

const router =  express.Router();

router.post("/register",registerHotel);
router.get("/get",getHotels);

export default router;