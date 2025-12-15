
import express from "express";
import emotionController from "../controllers/emotionController.js";
const router = express.Router();
router.post('/:userId', emotionController.createEntry); 
router.get('/stats/:userId', emotionController.getStats);
router.get('/:userId', emotionController.getHistory);
export default router;