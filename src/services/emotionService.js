import prisma from "../config/prismaClient.js"; 

const createEmotionEntry = async (userId, data) => {
  return await prisma.emotionDiary.create({
    data: {
      userId: parseInt(userId, 10),
      note: data.note,
      moodScore: data.moodScore,
      diaryDate: data.diaryDate,
      iconUrl: data.iconUrl
    },
  });
};

const getEmotionStats = async (userId) => {
  const stats = await prisma.emotionDiary.groupBy({
    by: ['iconUrl'], 
    where: { userId: parseInt(userId, 10) },
    _count: { iconUrl: true },
  });
  return stats.map(item => ({
    label: item.iconUrl || 'Khác',
    value: item._count.iconUrl
  }));
};

const getHistory = async (userId) => {
  const history = await prisma.emotionDiary.findMany({
    where: { userId: parseInt(userId, 10) },
    orderBy: { diaryDate: 'desc' } 
  });

  return history.map(item => ({
    ...item,
    mood: item.iconUrl || '😐' 
  }));
}

export default {
  createEmotionEntry,
  getEmotionStats,
  getHistory
}