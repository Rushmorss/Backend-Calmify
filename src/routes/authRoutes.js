import express from "express";
import authController from "../controllers/authController.js"; 
import {authMiddleware , restrictToAdmin } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);
router.get("/me", authMiddleware, authController.getMe);
router.get("/admin/users", authMiddleware, restrictToAdmin, (req, res) => {
    res.json({ success: true, message: "Chào Admin, đây là danh sách users" });
});
export default router;
