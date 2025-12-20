import prisma from "../config/prismaClient.js";
import { sendEmail } from "../utils/mailer.js";
const getMoodScore = (moodString) => {
  const mapping = {
    "Rất vui": 5,
    Vui: 4,
    "Bình thường": 3,
    Buồn: 2,
    "Rất buồn": 1,
  };
  return mapping[moodString] || 3;
};

const calculateAverage = (records) => {
  if (!records || records.length === 0) return 0;
  const total = records.reduce(
    (sum, record) =>
      sum +
      (record.moodScore !== null
        ? record.moodScore
        : getMoodScore(record.mood)),
    0
  );
  return parseFloat((total / records.length).toFixed(1));
};
const getStatistics = async (currentUser, type, dateParam, targetUserId) => {
  let userIdToQuery = currentUser.id;
  if (String(currentUser.role).toUpperCase() === "ADMIN" && targetUserId) {
    userIdToQuery = targetUserId;
  }
  const queryDate = dateParam ? new Date(dateParam) : new Date();
  let startDate = new Date();
  let endDate = new Date();
  let labels = [];
  let chartData = [];
  try {
    if (type === "day") {
      startDate = new Date(queryDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(queryDate);
      endDate.setHours(23, 59, 59, 999);

      const records = await prisma.emotionDiary.findMany({
        where: {
          userId: userIdToQuery,
          createdAt: { gte: startDate, lte: endDate },
        },
        orderBy: { createdAt: "asc" },
      });

      records.forEach((record) => {
        const h = new Date(record.createdAt)
          .getHours()
          .toString()
          .padStart(2, "0");
        const m = new Date(record.createdAt)
          .getMinutes()
          .toString()
          .padStart(2, "0");
        labels.push(`${h}:${m}`);
        chartData.push(
          record.moodScore !== null
            ? record.moodScore
            : getMoodScore(record.mood)
        );
      });
    } else if (type === "week") {
      const dayOfWeek = queryDate.getDay();
      const diffToMonday =
        queryDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(queryDate);
      startDate.setDate(diffToMonday);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      const records = await prisma.emotionDiary.findMany({
        where: {
          userId: userIdToQuery,
          createdAt: { gte: startDate, lte: endDate },
        },
      });

      const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + i);
        const dayRecords = records.filter((r) => {
          const rDate = new Date(r.createdAt);
          return (
            rDate.getDate() === currentDay.getDate() &&
            rDate.getMonth() === currentDay.getMonth()
          );
        });
        labels.push(weekDays[i]);
        chartData.push(calculateAverage(dayRecords));
      }
    } else if (type === "month") {
      startDate = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
      endDate = new Date(
        queryDate.getFullYear(),
        queryDate.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      const records = await prisma.emotionDiary.findMany({
        where: {
          userId: userIdToQuery,
          createdAt: { gte: startDate, lte: endDate },
        },
      });

      const daysInMonth = endDate.getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dayRecords = records.filter(
          (r) => new Date(r.createdAt).getDate() === d
        );
        labels.push(`${d}/${queryDate.getMonth() + 1}`);
        chartData.push(calculateAverage(dayRecords));
      }
    }
    const testHistory = await getTestHistory(userIdToQuery);
    return {
      chart: { labels, data: chartData },
      testHistory: testHistory,
      summary: { viewingUserId: userIdToQuery },
    };
  } catch (error) {
    console.error("Lỗi getStatistics:", error);
    throw new Error("Không thể lấy dữ liệu thống kê.");
  }
};
const getTestHistory = async (userId) => {
  try {
    const assessments = await prisma.assessment.findMany({
      where: { userId: userId },
      include: { testType: true },
      orderBy: { createdAt: "asc" },
    });
    const historyMap = {};
    assessments.forEach((record) => {
      const testCode = record.testTypeCode || "UNKNOWN";
      if (!historyMap[testCode]) {
        historyMap[testCode] = {
          testName: record.testType?.name || record.testTypeCode, 
          attempts: [], 
        };
      }
      historyMap[testCode].attempts.push({
        id: record.id,
        date: record.createdAt,
        score: record.finalScore,
      });
    });
    const result = Object.values(historyMap).map((test) => {
      const totalCount = test.attempts.length;
      const lastAttempt = test.attempts[totalCount - 1]; 

      return {
        ...test,
        totalCount: totalCount,
        lastDate: lastAttempt ? lastAttempt.date : null, 
        lastScore: lastAttempt ? lastAttempt.score : null, 
      };
    });
    return result.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
  } catch (error) {
    console.error("Lỗi lấy lịch sử test:", error);
    return [];
  }
};
const getAdminOverview = async () => {
  const [totalUsers, totalTests] = await Promise.all([
    prisma.user.count(),
    prisma.assessment.count(),
  ]);
  return { totalUsers, totalTests };
};

const adminStatistics = {
  getGlobalEmotionStats: async () => {
    const stats = await prisma.emotionDiary.groupBy({
      by: ["iconId"],
      _count: {
        iconId: true,
      },
      _avg: {
        moodScore: true,
      },
    });
    const emotionDetails = await prisma.emotionIcon.findMany();
    return stats.map((stat) => ({
      ...stat,
      emotionName:
        emotionDetails.find((i) => i.id === stat.iconId)?.name || "Unknown",
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
      text: message,
    });

    return { success: true };
  },
};

const getAllUsersWithAssessmentStatus = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      nickname: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { assessments: true },
      },
      assessments: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      },
    },
  });
};

const getUserGrowthStats = async (year = new Date().getFullYear()) => {
  const queryYear = year || new Date().getFullYear();
  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: new Date(`${queryYear}-01-01`),
        lte: new Date(`${queryYear}-12-31`),
      },
    },
    select: { createdAt: true },
  });
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const growthData = months.map((m) => ({ label: m, count: 0 }));

  users.forEach((user) => {
    const monthIndex = new Date(user.createdAt).getMonth();
    growthData[monthIndex].count++;
  });
  return growthData;
};

export default {
  getStatistics,
  getTestHistory,
  getAdminOverview,
  adminStatistics,
  getAllUsersWithAssessmentStatus,
  getUserGrowthStats,
};