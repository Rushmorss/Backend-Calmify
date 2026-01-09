import express from "express";
import { sendMessage } from "../controllers/chatController.js"; 

const router = express.Router();
router.post("/send", sendMessage); 

export default router;