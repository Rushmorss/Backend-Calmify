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
// --- ADMIN ----
router.put("/update-profile", authMiddleware, authController.updateProfile);
router.get("/admin/users", authMiddleware, restrictToAdmin, authController.getAllUsers);
router.get("/admin/users/:id", authMiddleware, restrictToAdmin, authController.getUserDetail);
router.patch("/admin/users/:id/deactivate", authMiddleware, restrictToAdmin, authController.deactivateUser);
export default router;
