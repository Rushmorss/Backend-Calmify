import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getTestByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const test = await prisma.testType.findUnique({
      where: { code: code },
      include: {
        questions: {
          orderBy: { questionOrder: 'asc' } 
        },
        scales: {
          orderBy: { value: 'asc' } 
        }
      }
    });
    if (!test) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài test" });
    }
    res.status(200).json({ success: true, data: test });
  } catch (error) {
    console.error("Lỗi lấy chi tiết bài test:", error);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};
export const getAllTests = async (req, res) => {
    try {
        const tests = await prisma.testType.findMany();
        res.json({ success: true, data: tests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};