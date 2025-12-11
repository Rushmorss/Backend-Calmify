
import express from "express";
import emotionController from "../controllers/emotionController.js";
const router = express.Router();
router.post('/', emotionController.createEntry); 
router.get('/stats', emotionController.getStats);
router.get('/', emotionController.getHistory);
export default router;