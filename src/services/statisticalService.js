import prisma from "../config/prismaClient.js";
import { sendEmail } from "../utils/mailer.js";
const getMoodScore = (moodString) => {
    const mapping = { 'Rất vui': 5, 'Vui': 4, 'Bình thường': 3, 'Buồn': 2, 'Rất buồn': 1 };
    return mapping[moodString] || 3;
};

const calculateAverage = (records) => {
    if (!records || records.length === 0) return 0;
    const total = records.reduce((sum, record) => sum + (record.mood_score || getMoodScore(record.mood)), 0);
    return parseFloat((total / records.length).toFixed(1));
};

const formatTime = (dateObj) => {
    const h = dateObj.getHours().toString().padStart(2, '0');
    const m = dateObj.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
};

const getTestHistory = async (userId) => {
    try {
        const assessments = await prisma.assessment.findMany({
            where: { userId: userId },
            include: { 
                testType: true 
            },
            orderBy: { createdAt: 'desc' }
        });
        const historyMap = {};
        assessments.forEach(record => {
            const testCode = record.testTypeCode; 
            
            if (!historyMap[testCode]) {
                historyMap[testCode] = {
                    testId: record.testType.id, 
                    testCode: testCode,        
                    testName: record.testType.description || testCode, 
                    lastDate: record.createdAt,
                    lastScore: record.finalScore, 
                    totalCount: 0
                };
            }
            
            historyMap[testCode].totalCount++;
        });
        return Object.values(historyMap);
    } catch (error) {
        console.error("Lỗi lấy lịch sử test:", error);
        return [];
    }
};
const getStatistics = async (currentUser, type, dateParam, targetUserId) => {
    let userIdToQuery = currentUser.id;
    if (currentUser.role === 'ADMIN' && targetUserId) {
        userIdToQuery = parseInt(targetUserId);
    }
    let startDate = new Date();
    let endDate = new Date();
    const queryDate = dateParam ? new Date(dateParam) : new Date();
    let labels = [];
    let chartData = [];
    if (type === 'day') {
    } else if (type === 'month') {
    } else if (type === 'year') {
        startDate = new Date(queryDate.getFullYear(), 0, 1);
        endDate = new Date(queryDate.getFullYear(), 11, 31, 23, 59, 59);
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const records = await prisma.emotionDiary.findMany({
            where: { userId: userIdToQuery, createdAt: { gte: startDate, lte: endDate } }
        });
        for (let m = 0; m < 12; m++) {
            const monthRecords = records.filter(r => new Date(r.createdAt).getMonth() === m);
            chartData.push(calculateAverage(monthRecords));
        }
    }
};

const getAdminOverview = async () => {
    const [totalUsers, totalTests] = await Promise.all([
        prisma.user.count(),
        prisma.assessment.count()
    ]);
    return { totalUsers, totalTests };
};
const adminStatistics = {
  getGlobalEmotionStats: async () => {
    const stats = await prisma.emotionDiary.groupBy({
      by: ['iconId'],
      _count: { 
        iconId: true 
      },
      _avg: {
        moodScore: true 
      }
    });
    const emotionDetails = await prisma.emotionIcon.findMany();
    return stats.map(stat => ({
      ...stat,
      emotionName: emotionDetails.find(i => i.id === stat.iconId)?.name || "Unknown"
    }));
  },
  sendAdminNotification: async (email, subject, message) => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">Thông báo từ Calmify Admin</h2>
        <p style="font-size: 16px; color: #333;">Xin chào,</p>
        <p style="font-size: 16px; color: #333; line-height: 1.5;">${message}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="text-align: center; font-size: 12px; color: #888;">
          Đây là email hệ thống từ đội ngũ quản trị Calmify, vui lòng không phản hồi trực tiếp vào email này.
        </p>
      </div>
    `;
    await sendEmail({ 
      to: email, 
      subject: subject || "Thông báo từ Calmify", 
      html, 
      text: message 
    });
    
    return { success: true };
  }
};
export default {
    getStatistics,
    getAdminOverview,
    adminStatistics,
    getTestHistory
};