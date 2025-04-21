import express from "express";
import { verifyToken } from '../utils/verifyUser.js';
import { createHotelComment, editComment, getCommentsByHotelId } from "../controllers/comment.controller.js";
const router = express.Router();

router.post("/createComment", createHotelComment);
router.get("/getComments/:hotelId", getCommentsByHotelId);
router.patch('/editComment/:commentId', verifyToken, editComment);

export default router;
