import emotionService from "../services/emotionService.js";
const createEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { note, mood } = req.body;

    if (!mood) {
      return res.status(400).json({ message: "Vui lòng chọn nhãn dán cảm xúc" });
    }

    const newEntry = await emotionService.createEmotionEntry(userId, { note, mood });
    
    return res.status(201).json({
      message: "Đã lưu nhật ký thành công",
      data: newEntry
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await emotionService.getEmotionStats(userId);
    
    return res.status(200).json({
      message: "Lấy thống kê thành công",
      data: data 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const data = await emotionService.getHistory(userId);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server" });
    }
}

export default {
  createEntry,
  getStats,
  getHistory
}