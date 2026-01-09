import { PrismaClient } from "@prisma/client";
import * as testService from "../services/testService.js";
const prisma = new PrismaClient();

export const getAllTests = async (req, res) => {
  try {
    const tests = await prisma.testType.findMany({
      select: {
        id: true,
        code: true,
        title: true,
        description: true,
      },
    });
    const formatted = tests.map((t) => ({
      id: t.id,
      code: t.code,
      name: t.title,
      description: t.description,
    }));
    return res.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Lỗi getAllTests:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const getTestById = async (req, res) => {
  try {
    const { code } = req.params; 
    const testType = await prisma.testType.findUnique({
      where: { code: code },
    });

    if (!testType) {
      return res.status(404).json({ message: "Không tìm thấy bài test" });
    }
    const testCode = testType.code;
    const scaleOptions = await prisma.testScale.findMany({
      where: { testCode: testCode },
      orderBy: { label: "asc" },
    });
    const optionsForFE = scaleOptions.map((opt, idx) => ({
      id: opt.id,
      optionText: opt.label,
      score: idx,
    }));
    const questions = await prisma.question.findMany({
      where: { testCode: testCode },
      orderBy: { questionOrder: "asc" },
    });
    return res.json({
      success: true,
      data: {
        testName: testType.title,
        testCode: testCode,
        description: testType.description,
        questions: questions.map((q) => ({
          id: q.id,
          questionText: q.content,
          category: q.category,
          options: optionsForFE, 
        })),
      },
    });
  } catch (error) {
    console.error("Lỗi getTestById:", error);
    return res.status(500).json({ message: "Lỗi Server" });
  }
};
export const submitTest = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Bạn cần đăng nhập" });
    }
    const { testCode, answers } = req.body;
    const userId = req.user.id;

    if (!testCode || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
    const result = await testService.saveTestResult(userId, testCode, answers);
    return res.status(201).json({
      success: true,
      message: "Lưu kết quả thành công",
      data: result,
    });
  } catch (err) {
    console.error("Submit Error:", err);
    return res.status(500).json({ message: "Lỗi Server khi nộp bài" });
  }
};

export const getTestResultById = async (req, res) => {
  try {
    const identifier = String(req.params.id);
    let result = await prisma.assessment.findUnique({ where: { id: identifier } });
    if (!result) {
      const rows = await prisma.$queryRaw`
        SELECT * FROM assessments WHERE id = ${req.params.id} OR id = ${identifier} LIMIT 1
      `;
      if (Array.isArray(rows) && rows.length > 0) result = rows[0];
    }
    if (!result)
      return res.status(404).json({ message: "Không tìm thấy kết quả" });

    let detail = result.resultDetail;
    if (typeof detail === "string") {
      try {
        detail = JSON.parse(detail);
      } catch (e) {}
    }
    return res.json({
      success: true,
      data: {
        id: result.id,
        totalScore: result.finalScore,
        level: detail?.severity || "N/A",
        description: detail?.description || "",
        advice: detail?.advice || "",
        createdAt: result.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
export const getAdminTests = async (req, res) => {
  try {
    const tests = await prisma.testType.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { id: 'desc' }
    });
    const formatted = tests.map(t => ({
      id: t.id,
      code: t.code,
      name: t.title,
      questionCount: t._count.questions,
      status: "Active", 
    }));

    return res.json({ success: true, data: formatted });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi lấy danh sách admin" });
  }
};

export const createTest = async (req, res) => {
  try {
    const { code, title, description, questions, scales } = req.body;

    if (!code || !title || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const newTest = await testService.createFullTest({
      code, title, description, questions, scales
    });
    return res.status(201).json({ success: true, message: "Tạo bài test thành công", data: newTest });
  } catch (error) {
    console.error("Create Test Error:", error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Mã bài test (Code) đã tồn tại!" });
    }
    return res.status(500).json({ message: "Lỗi server khi tạo bài test" });
  }
};

export const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, title, description, questions, scales } = req.body;

    const updated = await testService.updateFullTest(id, {
      code, title, description, questions, scales
    });

    return res.json({ success: true, message: "Cập nhật thành công", data: updated });
  } catch (error) {
    console.error("Update Test Error:", error);
    return res.status(500).json({ message: "Lỗi server khi update" });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    await testService.deleteTest(id);
    return res.json({ success: true, message: "Đã xóa bài test" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Không thể xóa bài test này" });
  }
};

export const getTestForEdit = async (req, res) => {
    try {
        const { id } = req.params;
        const identifier = String(id);
        let test = await prisma.testType.findFirst({
            where: { OR: [{ id: identifier }, { code: identifier }] },
            include: {
                questions: { orderBy: { questionOrder: 'asc' } },
                testScales: true 
            }
        });
        if (!test) {
            const rows = await prisma.$queryRaw`
              SELECT t.* FROM test_types t WHERE t.id = ${id} OR t.id = ${identifier} OR t.code = ${identifier} LIMIT 1
            `;
            if (Array.isArray(rows) && rows.length > 0) {
              test = rows[0];
              const testCode = test.code;
              const [questions, testScales] = await Promise.all([
                prisma.question.findMany({ where: { testCode }, orderBy: { questionOrder: 'asc' } }),
                prisma.testScale.findMany({ where: { testCode }, orderBy: { label: 'asc' } }),
              ]);
              test.questions = questions;
              test.testScales = testScales;
            }
        }
        if (!test) return res.status(404).json({ message: "Không tìm thấy" });
        return res.json({ success: true, data: test });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server" });
    }
};