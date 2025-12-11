import express from 'express';
import * as testController from '../controllers/testController.js';
import authMiddleware from '../middlewares/auth.middleware.js'; 

const router = express.Router();
router.get('/:code', testController.getTestContent);
router.post('/submit', authMiddleware, testController.submitTest);

export default router;