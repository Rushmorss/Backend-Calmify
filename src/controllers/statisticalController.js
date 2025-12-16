import statisticalService from '../services/statisticalService.js';

const getStatistics = async (req, res) => {
    try {
        const currentUser = req.user; 
        const { type, date, targetUserId } = req.query;
        const data = await statisticalService.getStatistics(currentUser, type, date, targetUserId);
        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Lỗi Server"
        });
    }
};

export default {
    getStatistics
};