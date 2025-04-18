import express from "express";
import { addHotelStructure, addStaff, getAvailableWaiters, getHotelBills, getHotels, getHotelTables, registerHotel } from "../controllers/hotel.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router =  express.Router();

router.post("/register",registerHotel);
router.get("/get",getHotels);
router.post("/addStaff",verifyToken, addStaff);
router.post("/addStructure",addHotelStructure);
router.get("/getBills", getHotelBills);
router.get("/getHotelTables",getHotelTables);
router.get("/available-waiters",getAvailableWaiters);

export default router;