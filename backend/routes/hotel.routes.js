import express from "express";
import { addHotelStructure, addStaff, deleteStaff, getAvailableWaiters, getHotelBills, getHotels, getHotelStaff, getHotelTables, registerHotel, updateStaff } from "../controllers/hotel.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router =  express.Router();

router.post("/register",registerHotel);
router.get("/get",getHotels);
router.post("/addStaff",verifyToken, addStaff);
router.post("/addStructure",addHotelStructure);
router.get("/getBills", getHotelBills);
router.get("/getHotelTables",getHotelTables);
router.get("/available-waiters",getAvailableWaiters);
router.get("/getStaff", getHotelStaff);
router.patch("/removeStaff", deleteStaff);
router.patch("/updateStaff", updateStaff);

export default router;