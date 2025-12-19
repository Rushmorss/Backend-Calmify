import statisticalService from '../services/statisticalService.js';

const getStatistics = async (req, res) => {
    try {
        const currentUser = req.user; 
        if (!currentUser) {
            return res.status(401).json({ 
                success: false, 
                message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập." 
            });
        }
        const { type, date, targetUserId } = req.query;
        const data = await statisticalService.getStatistics(currentUser, type, date, targetUserId);
        return res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error("Lỗi Controller Thống kê:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi Server: " + (error.message || "Unknown error")
        });
    }
};
const getAdminDashboardOverview = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: "Từ chối truy cập." });
        }
        const stats = await statisticalService.getAdminOverview();
        return res.status(200).json({
            success: true,
            data: stats 
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
export default {
    getStatistics,
    getAdminDashboardOverview
};