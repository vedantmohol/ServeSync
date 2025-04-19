import express from "express";
import { createHotelComment } from "../controllers/comment.controller.js";
const router = express.Router();

router.post("/createComment", createHotelComment);

export default router;
