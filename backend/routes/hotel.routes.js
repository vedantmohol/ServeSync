import express from "express";
import { addHotelStructure, addStaff, getHotelBills, getHotels, registerHotel } from "../controllers/hotel.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router =  express.Router();

router.post("/register",registerHotel);
router.get("/get",getHotels);
router.post("/addStaff",verifyToken, addStaff);
router.post("/addStructure",addHotelStructure);
router.get("/getBills", getHotelBills);

export default router;