import express from 'express';
import statisticalController from '../controllers/statisticalController.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get('/', authMiddleware, statisticalController.getStats);
export default router;