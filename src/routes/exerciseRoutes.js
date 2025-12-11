import express from 'express';
import * as exerciseController from '../controllers/exerciseController.js';
import authMiddleware from '../middlewares/auth.middleware.js'; 

const router = express.Router();
router.get('/categories', authMiddleware, exerciseController.getCategories);
router.get('/categories/:id', authMiddleware, exerciseController.getExercisesByCategory);
router.get('/detail/:id', authMiddleware, exerciseController.getExerciseDetail);

export default router;