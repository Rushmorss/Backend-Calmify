import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const saveAssessment = async (req, res) => {
 try {
const { userId, testCode, answers } = req.body;

 let finalUserId = null;
 let isGuest = true;

 if (userId) {
      const asString = String(userId).trim();
      if (asString) {
        finalUserId = asString;
        isGuest = false;
      }
    }
    if (!finalUserId) {
      finalUserId = '1';
      isGuest = true;
    }
 const answersArray = Object.values(answers);
 const scoreValue = answersArray.reduce((acc, curr) => acc + (parseInt(curr) || 0), 0);
 let severity = 'Không/Tối thiểu';
 if (scoreValue >= 5) severity = 'Nhẹ';
 if (scoreValue >= 10) severity = 'Trung bình';
 if (scoreValue >= 15) severity = 'Trung bình nặng';
 if (scoreValue >= 20) severity = 'Nặng';
 const assessment = await prisma.assessment.create({
 data: {
 userId: finalUserId, 
 testTypeCode: testCode,
 finalScore: scoreValue,
 severity: severity,
 answers: answers, 
 resultDetail: { 
            advice: "Kết quả được lưu sau khi đăng nhập.", 
            isGuest: isGuest 
        },
 }
 });
 return res.status(201).json({ message: "Đã lưu kết quả thành công!", data: assessment });
 } catch (error) {
 console.error("Lỗi lưu assessment:", error);
 return res.status(500).json({ message: "Lỗi server", detail: error.message }); 
 }
};