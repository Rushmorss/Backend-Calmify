import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const saveAssessment = async (req, res) => {
  try {
    console.log("--- BẮT ĐẦU DEBUG API SAVE ASSESSMENT ---");
    const { testCode, score, severity, details } = req.body;
    console.log("Body nhận được:", { testCode, score, severity });
    console.log("Details type:", typeof details);
    console.log("User từ req.user:", req.user);
    if (!req.user || !req.user.id) {
      console.log("LỖI: Không tìm thấy User ID!");
      return res.status(401).json({ success: false, message: "User invalid" });
    }
    const userId = req.user.id;
    console.log(`Đang tìm TestType với code: '${testCode}'...`);
    const testTypeExists = await prisma.testType.findUnique({
      where: { code: testCode },
    });
    console.log("Kết quả tìm TestType:", testTypeExists);

    if (!testTypeExists) {
      return res.status(400).json({ success: false, message: "Test code not found" });
    }
    const dataToSave = {
        userId: userId,
        testTypeCode: testCode,
        finalScore: parseInt(score),
        severity: severity,
        resultDetail: details,
        answers: details,      
    };
    console.log("Dữ liệu chuẩn bị nạp vào Prisma:", dataToSave);
    const newAssessment = await prisma.assessment.create({
      data: dataToSave,
    });
    console.log("--- LƯU THÀNH CÔNG ---");
    return res.status(201).json({
      success: true,
      message: "Lưu kết quả thành công!",
      data: newAssessment,
    });

  } catch (error) {
    console.error(">>> LỖI PRISMA CHI TIẾT:", error); 
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};