import express from "express";
import { createHotelComment, getCommentsByHotelId } from "../controllers/comment.controller.js";
const router = express.Router();

router.post("/createComment", createHotelComment);
router.get("/getComments/:hotelId", getCommentsByHotelId);

export default router;
