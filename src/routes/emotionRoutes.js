import express from "express";
import emotionController from "../controllers/emotionController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/:userId", authMiddleware, emotionController.createEntry);
router.get("/stats/:userId", authMiddleware, emotionController.getStats);
router.get("/:userId", authMiddleware, emotionController.getHistory);
export default router;