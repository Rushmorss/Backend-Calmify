import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const analyzeResult = (testCode, score) => {
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

  if (testCode === "DASS21") {
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

export const saveTestResult = async (userId, testCode, answers) => {
  const totalScore = answers.reduce(
    (sum, item) => sum + parseInt(item.score),
    0
  );

  const analysis = analyzeResult(testCode, totalScore);
  const resultDetailJson = {
    severity: analysis.severity,
    description: analysis.resultDetail,
    advice: analysis.advice,
    user_answers: answers,
  };

  try {
    console.log("💾 Đang lưu vào DB...");
    const resultRecord = await prisma.assessment.create({
      data: {
        userId: userId, 
        testTypeCode: testCode, 
        finalScore: totalScore, 
        resultDetail: resultDetailJson, 
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

export const createFullTest = async (data) => {
  const { code, title, description, questions, scales } = data;
  return await prisma.$transaction(async (tx) => {
    const newTest = await tx.testType.create({
      data: {
        code,
        title,
        description,
        questions: {
          create: questions.map((q, index) => ({
            content: q.questionText,
            category: q.category || "General",
            questionOrder: index + 1,
          })),
        },
        testScales: {
          create: scales.map((s, index) => ({
            label: s.label,
          })),
        },
      },
      include: {
        questions: true,
        testScales: true,
      },
    });
    return newTest;
  });
};

export const updateFullTest = async (id, data) => {
  const { code, title, description, questions, scales } = data;
  return await prisma.$transaction(async (tx) => {
    const identifier = String(id);
    let existing = await tx.testType.findFirst({
      where: { OR: [{ id: identifier }, { code: identifier }] },
    });
    if (!existing) {
      const rows = await tx.$queryRaw`
        SELECT * FROM test_types WHERE id = ${id} OR id = ${identifier} OR code = ${identifier} LIMIT 1
      `;
      if (Array.isArray(rows) && rows.length > 0) {
        existing = rows[0];
      }
    }
    if (!existing) throw new Error("Test not found");
    const prevCode = existing.code;
    const updatedTest = await tx.testType.update({
      where: { code: prevCode },
      data: {
        code,
        title,
        description,
      },
    });

    if (questions && questions.length > 0) {
      await tx.question.deleteMany({ where: { testCode: prevCode } });
      await tx.question.createMany({
        data: questions.map((q, index) => ({
          testCode: code,
          content: q.questionText,
          category: q.category || "General",
          questionOrder: index + 1,
        })),
      });
    }

    if (scales && scales.length > 0) {
      await tx.testScale.deleteMany({ where: { testCode: prevCode } });
      await tx.testScale.createMany({
        data: scales.map((s) => ({
          testCode: code,
          label: s.label,
        })),
      });
    }

    return updatedTest;
  });
};

export const deleteTest = async (id) => {
  const identifier = String(id);
  let test = await prisma.testType.findFirst({ where: { OR: [{ id: identifier }, { code: identifier }] } });
  if (!test) {
    const rows = await prisma.$queryRaw`
      SELECT * FROM test_types WHERE id = ${id} OR id = ${identifier} OR code = ${identifier} LIMIT 1
    `;
    if (Array.isArray(rows) && rows.length > 0) test = rows[0];
  }

  if (!test) throw new Error("Test not found");
  const code = test.code;
  return await prisma.$transaction([
    prisma.question.deleteMany({ where: { testCode: code } }),
    prisma.testScale.deleteMany({ where: { testCode: code } }),
    prisma.assessment.deleteMany({ where: { testTypeCode: code } }),
    prisma.testType.delete({ where: { code } }),
  ]);
};
