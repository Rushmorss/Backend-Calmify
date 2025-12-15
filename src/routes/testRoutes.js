import express from "express";
import {
  getTestById,
  submitTest,
  getTestResultById,
} from "../controllers/testController.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/submit", authMiddleware, submitTest);
router.get("/result/:id", authMiddleware, getTestResultById);
router.get("/:code", getTestById);

export default router;
