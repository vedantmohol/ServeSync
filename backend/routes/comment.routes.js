import express from "express";
import { verifyToken } from '../utils/verifyUser.js';
import { createHotelComment, deleteComment, editComment, getCommentsByHotelId } from "../controllers/comment.controller.js";
const router = express.Router();

router.post("/createComment", createHotelComment);
router.get("/getComments/:hotelId", getCommentsByHotelId);
router.patch('/editComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);

export default router;
