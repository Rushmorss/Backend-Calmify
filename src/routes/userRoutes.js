import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.middleware.js"
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/settings', userController.updateSettings);
router.post('/avatar',authMiddleware, userController.uploadAvatar);

export default router;