// backend/src/routes/userRoutes.js
import express from "express";
import { updateUser, updateAvatar, getMe } from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Tạo thư mục nếu chưa tồn tại (Tránh lỗi không tìm thấy folder)
const uploadDir = "uploads/avatars/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Thêm timestamp để tên file không bị trùng
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Routes
router.get("/me", authMiddleware, getMe);           // Lấy info
router.patch("/me", authMiddleware, updateUser);    // Cập nhật info
router.patch("/me/avatar", authMiddleware, upload.single("avatar"), updateAvatar); // Cập nhật avatar

export default router;