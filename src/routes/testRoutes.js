import express from "express";
import {
  getTestById,
  submitTest,
  getTestResultById,
  getAllTests,
  getAdminTests,
  createTest,
  updateTest,
  deleteTest,
  getTestForEdit
} from "../controllers/testController.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/submit", authMiddleware, submitTest);
router.get("/result/:id", authMiddleware, getTestResultById);
router.get("/", getAllTests);
router.get("/:code", getTestById);
//--- ADMIN ROUTES ---
router.get("/admin/list", authMiddleware, getAdminTests);
router.get("/admin/:id", authMiddleware, getTestForEdit);
router.post("/", authMiddleware, createTest);
router.put("/:id", authMiddleware, updateTest);
router.delete("/:id", authMiddleware, deleteTest);
export default router;
