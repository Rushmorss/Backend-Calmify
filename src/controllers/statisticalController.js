import statisticalService from "../services/statisticalService.js";

const getStatistics = async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Chưa đăng nhập. Vui lòng gửi kèm Token.",
      });
    }
    const { type, date, targetUserId } = req.query;
    const data = await statisticalService.getStatistics(
      currentUser,
      type,
      date,
      targetUserId
    );

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Lỗi Controller getStatistics:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi Server",
    });
  }
};
const getAdminDashboardOverview = async (req, res) => {
  try {
    if (String(req.user.role).toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Từ chối truy cập." });
    }
    const stats = await statisticalService.getAdminOverview();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getAllUsersStatus = async (req, res) => {
  try {
    if (String(req.user.role).toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Từ chối truy cập." });
    }
    const data = await statisticalService.getAllUsersWithAssessmentStatus();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserGrowth = async (req, res) => {
  try {
    if (String(req.user.role).toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Từ chối truy cập." });
    }
    const { period } = req.query;
    const data = await statisticalService.getUserGrowthStats(period);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTestHistory = async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) return res.status(401).json({ success: false, message: "Chưa đăng nhập." });
    const data = await statisticalService.getTestHistory(currentUser.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export default {
  getStatistics,
  getAdminDashboardOverview,
  getAllUsersStatus,
  getUserGrowth,
  getTestHistory
};