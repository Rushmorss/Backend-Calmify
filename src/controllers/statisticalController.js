import statisticalService from "../services/statisticalService.js";

const getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, date } = req.query;

        const validTypes = ['day', 'week', 'month', 'quarter', 'year'];

        if (!type || !validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Tham số 'type' không hợp lệ (day, week, month, quarter, year)."
            });
        }

        const data = await statisticalService.getStatistics(userId, type, date);
        
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error("Lỗi thống kê:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server."
        });
    }
};

export default {
    getStats
};