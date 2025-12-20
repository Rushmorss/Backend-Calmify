import express from "express";
import authController from "../controllers/authController.js"; 
import {authMiddleware , restrictToAdmin } from "../middlewares/auth.middleware.js";
import * as statisticalService from "../services/statisticalService.js";
const router = express.Router();

//--- USER ---
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);
router.get("/me", authMiddleware, authController.getMe);
// --- ADMIN ----
router.put("/update-profile", authMiddleware, restrictToAdmin, authController.updateProfile);
router.get("/admin/users", authMiddleware, restrictToAdmin, authController.getAllUsers);
router.get("/admin/users/:id", authMiddleware, restrictToAdmin, authController.getUserDetail);
router.patch("/admin/users/:id/deactivate", authMiddleware, restrictToAdmin, authController.deactivateUser);
router.post("/admin/users", authMiddleware, restrictToAdmin, authController.adminCreateUser); 
router.put("/admin/users/:id", authMiddleware, restrictToAdmin, authController.adminUpdateUser); 
router.delete("/admin/users/:id", authMiddleware, restrictToAdmin, authController.adminDeleteUser); 
router.get("/admin/stats/emotions", authMiddleware, restrictToAdmin, async (req, res) => {
    const data = await statisticalService.getGlobalEmotionStats();
    res.json({ success: true, data });
});
router.post("/admin/send-email", authMiddleware, restrictToAdmin, async (req, res) => {
    const { email, subject, message } = req.body;
    await statisticalService.adminStatistical(email, subject, message);
    res.json({ success: true, message: "Email đã được gửi thành công" });
});
export default router;
