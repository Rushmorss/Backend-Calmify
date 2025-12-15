import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const analyzeResult = (testCode, score) => {
  // Logic cho PHQ-9
  if (testCode === "PHQ9") {
    if (score <= 4)
      return {
        severity: "Minimal",
        resultDetail: "Không có triệu chứng trầm cảm.",
        advice: "Tự chăm sóc, duy trì lối sống lành mạnh.",
      };
    if (score <= 9)
      return {
        severity: "Mild",
        resultDetail: "Trầm cảm nhẹ.",
        advice: "Theo dõi thêm, chia sẻ với người thân.",
      };
    if (score <= 14)
      return {
        severity: "Moderate",
        resultDetail: "Trầm cảm vừa.",
        advice: "Nên tìm kiếm hỗ trợ từ chuyên gia tâm lý.",
      };
    if (score <= 19)
      return {
        severity: "Moderately Severe",
        resultDetail: "Trầm cảm khá nặng.",
        advice: "Cần tham vấn bác sĩ hoặc chuyên gia ngay.",
      };
    return {
      severity: "Severe",
      resultDetail: "Trầm cảm nặng.",
      advice: "Cần can thiệp y tế khẩn cấp.",
    };
  }

  // Logic cho DASS-21
  if (testCode === "DASS21") {
    // Logic đơn giản hóa cho DASS-21 dựa trên tổng điểm
    if (score <= 20)
      return {
        severity: "Normal",
        resultDetail: "Bình thường",
        advice: "Sức khỏe tinh thần ổn định.",
      };
    if (score <= 40)
      return {
        severity: "Moderate",
        resultDetail: "Có dấu hiệu căng thẳng/lo âu",
        advice: "Nên nghỉ ngơi và thư giãn.",
      };
    return {
      severity: "Severe",
      resultDetail: "Mức độ nặng",
      advice: "Cần tìm kiếm sự giúp đỡ chuyên nghiệp.",
    };
  }

  return {
    severity: "Unknown",
    resultDetail: "Chưa xác định",
    advice: "Đã ghi nhận kết quả.",
  };
};

// =======================================================
// 2. HÀM LƯU KẾT QUẢ VÀO DB (Đã đồng bộ với Schema)
// =======================================================
export const saveTestResult = async (userId, testCode, answers) => {
  // 1. Tính tổng điểm (Bây giờ answers đã là Array nên reduce mới chạy được)
  const totalScore = answers.reduce(
    (sum, item) => sum + parseInt(item.score),
    0
  );

  // 2. Phân tích kết quả
  const analysis = analyzeResult(testCode, totalScore);

  // 3. Đóng gói thông tin phụ vào JSON
  const resultDetailJson = {
    severity: analysis.severity,
    description: analysis.resultDetail,
    advice: analysis.advice,
    user_answers: answers,
  };

  try {
    console.log("💾 Đang lưu vào DB...");

    // 4. Lưu vào Database (Mapping đúng tên cột)
    const resultRecord = await prisma.assessment.create({
      data: {
        userId: userId, // Cột user_id
        testTypeCode: testCode, // Cột test_type
        finalScore: totalScore, // Cột final_score
        resultDetail: resultDetailJson, // Cột result_detail (JSON)
      },
    });

    console.log("✅ Lưu thành công ID:", resultRecord.id);

    return {
      resultId: resultRecord.id,
      totalScore: totalScore,
      level: analysis.severity,
      description: analysis.resultDetail,
      advice: analysis.advice,
    };
  } catch (err) {
    console.error("❌ Lỗi Prisma:", err);
    throw err;
  }
};
