import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserAssessmentContext = async (userId) => {
  try {
    const assessment = await prisma.assessment.findFirst({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
      include: {
        testType: true,
      },
    });
    if (!assessment) {
      return "Người dùng chưa thực hiện bài test tâm lý nào.";
    }
    let contextString = `
      - Loại bài test: ${assessment.testType.title} (${assessment.testType.code})
      - Ngày làm: ${new Date(assessment.createdAt).toLocaleDateString("vi-VN")}
      - Tổng điểm: ${assessment.finalScore}
      - Mức độ đánh giá sơ bộ: ${assessment.severity || "Chưa xác định"}
    `;
    if (assessment.resultDetail) {
        contextString += `\n- Chi tiết triệu chứng nổi bật: ${JSON.stringify(assessment.resultDetail)}`;
    }
    return contextString;
  } catch (error) {
    console.error("Lỗi lấy dữ liệu bài test:", error);
    return "Không thể lấy dữ liệu bài test do lỗi hệ thống.";
  }
};