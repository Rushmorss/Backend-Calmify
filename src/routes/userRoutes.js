import express from "express";
import { updateUser, updateAvatar, getMe } from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadDir = "uploads/avatars/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });
router.get("/me", authMiddleware, getMe);         
router.patch("/me", authMiddleware, updateUser);    
router.patch("/me/avatar", authMiddleware, upload.single("avatar"), updateAvatar); 

export default router;