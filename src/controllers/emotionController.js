import emotionService from "../services/emotionService.js";

const createEntry = async (req, res) => {
  try {
    const { userId } = req.params;
    const { note, mood } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin người dùng (User ID)" });
    }
    if (!mood) {
      return res
        .status(400)
        .json({ message: "Vui lòng chọn nhãn dán cảm xúc" });
    }
    let score = 3;
    if (["😡", "😭", "😞", "😩"].includes(mood)) score = 1;
    if (["😐", "😕", "😶"].includes(mood)) score = 3;
    if (["😄", "😁", "🥰", "🤩"].includes(mood)) score = 5;
    const diaryData = {
      note: note || "",
      moodScore: score,
      diaryDate: new Date(),
      iconUrl: mood,
    };
    const newEntry = await emotionService.createEmotionEntry(userId, diaryData);
    return res.status(201).json({
      success: true,
      message: "Đã lưu nhật ký thành công",
      data: newEntry,
    });
  } catch (error) {
    console.error("Lỗi createEntry:", error);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await emotionService.getEmotionStats(userId);
    return res.status(200).json({
      success: true,
      message: "Lấy thống kê thành công",
      data: data,
    });
  } catch (error) {
    console.error("Lỗi getStats:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await emotionService.getHistory(userId);
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Lỗi getHistory:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
export default {
  createEntry,
  getStats,
  getHistory,
};
