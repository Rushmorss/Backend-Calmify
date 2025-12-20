import express from "express";
import statisticalController from "../controllers/statisticalController.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/", authMiddleware, statisticalController.getStatistics);
router.get("/history", authMiddleware, statisticalController.getTestHistory);
//--- ADMIN ROUTES ---
router.get(
  "/overview",
  authMiddleware,
  statisticalController.getAdminDashboardOverview
);
router.get(
  "/admin/users-status",
  authMiddleware,
  statisticalController.getAllUsersStatus
);
router.get(
  "/admin/user-growth",
  authMiddleware,
  statisticalController.getUserGrowth
);
export default router;