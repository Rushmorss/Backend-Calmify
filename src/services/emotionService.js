import prisma from "../config/prismaClient.js";


const createEmotionEntry = async (userId, data) => {
  console.log("Creating entry for userId:", userId, "with data:", data);
  console.log("Creating entry for userId: 2", parseInt(userId, 10));
  return await prisma.emotionDiary.create({
    data: {
      userId: parseInt(userId, 10),
      note: data.note,
      mood: data.mood, 
    },
  });
};

const getEmotionStats = async (userId) => {
  const stats = await prisma.emotionDiary.groupBy({
    by: ['mood'],
    where: {
      userId: parseInt(userId, 10),
    },
    _count: {
      mood: true,
    },
  });
  return stats.map(item => ({
    label: item.mood,
    value: item._count.mood
  }));
};

const getHistory = async (userId) => {
    return await prisma.emotionDiary.findMany({
        where: { userId : parseInt(userId, 10) },
        orderBy: { createdAt: 'desc' }
    });
}

export default {
  createEmotionEntry,
  getEmotionStats,
  getHistory
}