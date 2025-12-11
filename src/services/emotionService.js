import prisma from "../config/prismaClient.js";


const createEmotionEntry = async (userId, data) => {
  return await prisma.emotionDiary.create({
    data: {
      userId: userId,
      note: data.note,
      mood: data.mood, 
    },
  });
};

const getEmotionStats = async (userId) => {
  const stats = await prisma.emotionDiary.groupBy({
    by: ['mood'],
    where: {
      userId: userId,
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
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
}

export default {
  createEmotionEntry,
  getEmotionStats,
  getHistory
}