import express from 'express';  
import supportController from '../controllers/supportController.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import supportValidation from '../validations/supportValidation.js';
const router = express.Router();

// --- PUBLIC ROUTES ---
router.get('/', supportController.getLocations);
// --- ADMIN ROUTES ---
router.get('/:id', authMiddleware, supportController.getLocationById);
router.post('/', authMiddleware, supportValidation.validateCreateSupport, supportController.createLocation);
router.put('/:id', authMiddleware, supportValidation.validateCreateSupport, supportController.updateLocation);
router.delete('/:id', authMiddleware, supportController.deleteLocation);

export default router;