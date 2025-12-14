import prisma from "../config/prismaClient.js";

const getUserProfile = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      age: true,
      gender: true,
      job: true,
      phoneNumber: true,
      createdAt: true,
      settings: true, 
    },
  });
};

const updateUserProfile = async (userId, data) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: data.fullName,
      age: data.age ? parseInt(data.age) : undefined, 
      gender: data.gender,
      job: data.job,
      phoneNumber: data.phoneNumber,
      avatar: data.avatar,
    },
    select: {
      id: true,
      fullName: true,
      age: true,
      gender: true,
      job: true,
      phoneNumber: true
    }
  });
};

const updateUserSettings = async (userId, settingsData) => {
  return await prisma.userSetting.upsert({
    where: { userId: userId },
    update: settingsData,
    create: {
      userId: userId,
      ...settingsData,
    },
  });
};

export default {
    getUserProfile,
    updateUserProfile,
    updateUserSettings
}