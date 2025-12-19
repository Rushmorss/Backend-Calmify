import { PrismaClient } from "@prisma/client";
import * as testService from "../services/testService.js";
const prisma = new PrismaClient();

export const getTestById = async (req, res) => {
  try {
    const { id } = req.params; 
    const testType = await prisma.testType.findUnique({
      where: { id: testId },
    });
    if (!testType) {
      return res.status(404).json({ message: "Không tìm thấy bài test này trong database" });
    }
    const testCode = testType.code;
    const scaleOptions = await prisma.testScale.findMany({
      where: { testCode: testCode },
      orderBy: { value: "asc" },
    });
    const optionsForFE = scaleOptions.map((opt) => ({
      id: opt.id,
      optionText: opt.label,
      score: opt.value,
    }));

    const questions = await prisma.question.findMany({
      where: { testCode: testCode },
      orderBy: { questionOrder: "asc" }, 
    });

    if (!questions.length) {
      console.warn(`Test ${testCode} không có câu hỏi nào.`);
    }


    return res.json({
      testName: testType.name || testType.code, 
      testCode, 
      description: testType.description || "",
      questions: questions.map((q) => ({
        id: q.id,
        questionText: q.content,
        category: q.category,
        options: optionsForFE, 
      })),
    });

  } catch (error) {
    console.error("❌ Lỗi getTestById:", error);
    return res.status(500).json({ message: "Lỗi Server khi tải bài test" });
  }
};

export const submitTest = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Bạn cần đăng nhập để nộp bài" });
    }

    const { testCode, answers } = req.body;
    const userId = req.user.id;

    console.log("📥 Submit Test:", { userId, testCode, count: answers?.length });

    if (!testCode || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Dữ liệu câu trả lời không hợp lệ" });
    }

    const result = await testService.saveTestResult(userId, testCode, answers);

    return res.status(201).json({
      success: true,
      message: "Đã lưu kết quả thành công",
      data: result,
    });
  } catch (err) {
    console.error("❌ Submit Test Error:", err);
    return res.status(500).json({
      message: "Lỗi Server khi nộp bài",
      error: err.message,
    });
  }
};

export const getTestResultById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await prisma.assessment.findUnique({
      where: { id },
    });

    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy kết quả" });
    }

    let detail = result.resultDetail;
    if (typeof detail === 'string') {
        try { detail = JSON.parse(detail) } catch(e) {}
    }

    return res.json({
      id: result.id,
      totalScore: result.finalScore,
      level: detail?.severity || "Không xác định",
      description: detail?.description || "",
      advice: detail?.advice || "",
      createdAt: result.createdAt
    });
  } catch (err) {
    console.error("❌ getTestResultById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};