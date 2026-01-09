import { processChat } from "../services/aiService.js"; 

export const sendMessage = async (req, res) => {
  try {
    const { userId, sessionId, message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Tin nhắn trống" });
    }
    const activeSessionId = sessionId || `sess_${Date.now()}`;
    console.log("Đang gửi tin nhắn tới OpenAI...");
    const result = await processChat(userId, activeSessionId, message);
    console.log("OpenAI đã trả lời:", result.reply);
    return res.status(200).json({
      success: true,
      aiReply: result.reply, 
      sessionId: activeSessionId,
      intent: result.intent,
      is_crisis: result.is_crisis
    });
  } catch (error) {
    console.error("Lỗi xử lý Chat:", error);
    return res.status(500).json({ 
      success: false, 
      message: "AI đang gặp sự cố, vui lòng thử lại.", 
      error: error.message 
    });
  }
};