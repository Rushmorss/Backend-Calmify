//aiService.js
import { fileSearchTool, Agent, Runner, withTrace } from "@openai/agents";
import { z } from "zod";
import prisma from '../config/prismaClient.js'; // Import Prisma để lưu DB

// ===================== CẤU HÌNH CÔNG CỤ & SCHEMA =====================
const fileSearch = fileSearchTool([
  "vs_6912ffb0bbcc819192d6a0157774b8be"
]);

const Agent1TriageKhNCPSchema = z.object({ is_crisis: z.boolean() });
const Agent2PhNLoINhSchema = z.object({
  intent: z.enum(["Venting", "Seeking Empathy", "Seeking Advice", "Casual Chat"])
});

// ===================== ĐỊNH NGHĨA AGENTS (Giữ nguyên logic của bạn) =====================
const agent1TriageKhNCP = new Agent({
  name: "Agent 1: Triage Khẩn cấp",
  instructions: `Bạn là một AI phân loại an toàn. Nhiệm vụ duy nhất của bạn là đọc tin nhắn cuối cùng của người dùng và xác định xem nội dung đó có chứa ý định tự tử, tự làm hại bản thân, hoặc tuyệt vọng cùng cực hay không, chỉ dựa trên các từ khóa cụ thể sau: "tự tử", "chết", "kết thúc", "không muốn sống", "chịu hết nổi", "làm hại mình", "vĩnh biệt".

QUY TẮC:
- Không trò chuyện, không phản hồi đồng cảm, không thêm bất kỳ lời hoặc văn bản nào ngoài đối tượng JSON.
- Chỉ phân tích dựa trên các từ khóa nêu trên.
- Nếu phát hiện nguy hiểm (tin nhắn chứa ý định tự tử, tự làm hại, tuyệt vọng cùng cực theo từ khóa), trả về đúng: {"is_crisis": true}
- Nếu KHÔNG phát hiện nguy hiểm, trả về đúng: {"is_crisis": false}
- Không bao giờ viết thêm bất kỳ câu, ký tự hay văn bản nào khác ngoài kết quả JSON duy nhất đó.

Output Format:
Luôn luôn trả về một trong hai đối tượng JSON sau, không kèm theo bất kỳ văn bản, giải thích, ký hiệu hoặc định dạng nào khác:
- {"is_crisis": true}
- {"is_crisis": false}`,
  model: "gpt-4.1",
  outputType: Agent1TriageKhNCPSchema,
  modelSettings: { temperature: 0, topP: 1, maxTokens: 300, store: true }
});

const agentKhNCP = new Agent({
  name: "Agent khẩn cấp",
  instructions:  `Hãy tạo câu trả lời bằng tiếng Việt sao cho thể hiện sự thấu hiểu và cung cấp thông tin về tổng đài hỗ trợ cho người dùng.

- Bắt đầu bằng việc thể hiện sự đồng cảm, sau đó mới cung cấp thông tin tổng đài.
- Sử dụng ngôn ngữ ngắn gọn, chân thành, tránh phán xét.
- Định dạng đầu ra: Một đoạn văn ngắn thể hiện sự đồng cảm, xuống dòng, rồi đến thông tin tổng đài hỗ trợ (ví dụ: 1900 1111). Không dùng code block.`,
  model: "gpt-4.1",
  modelSettings: { temperature: 1, topP: 1, maxTokens: 406, store: true }
});

const agent2PhNLoINh = new Agent({
  name: "Agent 2: Phân loại Ý định",
  instructions: `Đọc tin nhắn gần nhất trong ngữ cảnh của lịch sử hội thoại và phân loại ý định chính của người dùng thành một trong bốn lựa chọn sau:
- "Venting": Người dùng chỉ giãi bày, trút bầu tâm sự.
- "Seeking Empathy": Người dùng muốn được thấu hiểu, động viên.
- "Seeking Advice": Người dùng muốn được tư vấn, xin lời khuyên.
- "Casual Chat": Trò chuyện xã giao, chào hỏi.

Chỉ xuất ra DUY NHẤT một đối tượng JSON:
{"intent": "Venting" | "Seeking Empathy" | "Seeking Advice" | "Casual Chat"}

Luôn luôn:
- Phân tích ngữ cảnh toàn bộ lịch sử + tin nhắn mới nhất.
- Không đưa ra suy luận hay giải thích, chỉ xuất JSON.`,
  model: "gpt-4.1",
  outputType: Agent2PhNLoINhSchema,
  modelSettings: { temperature: 1, topP: 1, maxTokens: 2048, store: true }
});
const agent3AiThUCM = new Agent({
  name: "Agent 3: AI Thấu cảm",
  instructions: `Bạn là Calmify, một người bạn đồng hành thấu cảm, nhẹ nhàng và sâu sắc.

MỤC TIÊU:
- Khiến người dùng cảm thấy được lắng nghe thực sự chứ không phải đang nói chuyện với máy.
- Khuyến khích chia sẻ thêm hoặc tìm hỗ trợ chuyên gia nếu cần thiết.

PHONG CÁCH GIAO TIẾP (QUAN TRỌNG):
- **Tự nhiên & Linh hoạt:** Đừng trả lời theo công thức cố định. Hãy thay đổi cấu trúc câu. Có lúc chỉ cần một câu ngắn gọn ấm áp, có lúc là một đoạn chia sẻ sâu sắc.
- **Giọng điệu:** Ấm áp, chân thành, như một người bạn thân đang ngồi cạnh. Tránh sáo rỗng (như "tôi hiểu cảm giác của bạn"... hãy dùng cách diễn đạt khác đời thường hơn).
- **Emoji:** Sử dụng tinh tế (1-2 cái), đặt ở vị trí tự nhiên, không nhất thiết phải ở cuối câu.

NGUYÊN TẮC AN TOÀN:
- Không chẩn đoán bệnh.
- Luôn nhớ bạn là AI hỗ trợ.

HƯỚNG DẪN PHẢN HỒI:
1. Đọc cảm xúc ngầm của người dùng.
2. Phản hồi nương theo dòng cảm xúc đó. Đừng tách bạch rõ ràng "phần đồng cảm" và "phần câu hỏi". Hãy lồng ghép chúng vào nhau một cách mượt mà.
3. Kết thúc mở để người dùng dễ dàng tiếp tục câu chuyện.`,
  model: "gpt-4.1", 
  
  modelSettings: { temperature: 1, topP: 1, maxTokens: 2048, store: true }
});
// ===================== HÀM XỬ LÝ CHÍNH =====================
export const processChat = async (userId, sessionId, userMessage) => {
  // 1. Lưu tin nhắn của User vào DB trước
 // await prisma.chatMessage.create({
   // data: {
   //   sessionId: sessionId,
    //  sender: 'USER',
     // content: userMessage
   // }
  //});

  // 2. Chạy Workflow AI
  const aiResponse = await withTrace("calmify_chat_trace", async () => {
    const conversationHistory = [
      {
        role: "user",
        content: [{ type: "input_text", text: userMessage }]
      }
    ];

    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_6913738a4c58819082efadd29c8158170f3da1e017603e78"
      }
    });

    // --- Bước 1: Triage ---
    const agent1Res = await runner.run(agent1TriageKhNCP, [...conversationHistory]);
    if (!agent1Res.finalOutput) throw new Error("Lỗi Agent 1");
    const { is_crisis } = agent1Res.finalOutput;

    let finalReply = "";
    let detectedIntent = null;

    // --- Bước 2: Xử lý nhánh ---
    if (is_crisis) {
      const agentKhNCPRes = await runner.run(agentKhNCP, [...conversationHistory]);
      if (!agentKhNCPRes.finalOutput) throw new Error("Lỗi Agent Khẩn cấp");
      finalReply = agentKhNCPRes.finalOutput; // String
    } else {
      // Phân loại ý định
      const agent2Res = await runner.run(agent2PhNLoINh, [...conversationHistory]);
      detectedIntent = agent2Res.finalOutput?.intent || "Casual Chat";

      // AI trả lời thấu cảm
      const agent3Res = await runner.run(agent3AiThUCM, [...conversationHistory]);
      if (!agent3Res.finalOutput) throw new Error("Lỗi Agent 3");
      finalReply = agent3Res.finalOutput; // String
    }

    return { reply: finalReply, is_crisis, intent: detectedIntent };
  });

  // 3. Lưu câu trả lời của AI vào DB
  //await prisma.chatMessage.create({
    //data: {
    //  sessionId: sessionId,
      //sender: 'AI',
      //content: aiResponse.reply
   // }
  //});

  // 4. Cập nhật tóm tắt Session (Optional - có thể làm sau)
  
  return aiResponse;
};