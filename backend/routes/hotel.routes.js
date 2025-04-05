import express from "express";
import { registerHotel } from "../controllers/hotel.controller.js";

const router =  express.Router();

router.post("/register",registerHotel);

export default router;