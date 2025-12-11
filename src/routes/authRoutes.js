import express from "express";
import authController from "../controllers/authController.js"; 
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);
router.get("/me", authMiddleware, authController.getMe);

export default router;
