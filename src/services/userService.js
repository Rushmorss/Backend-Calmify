import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @param {number} 
 * @returns {Promise<Object>} 
 */
export const getUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      avatarUrl: true,
      age: true,
      gender: true,
      job: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * @param {number} 
 * @param {Object} 
 * @returns {Promise<Object>} 
 */
export const updateUserProfile = async (userId, updateData) => {
  const { nickname, age, gender, job } = updateData;
  const dataToUpdate = {};
  if (nickname !== undefined) dataToUpdate.nickname = nickname;
  if (age !== undefined) dataToUpdate.age = parseInt(age);
  if (gender !== undefined) dataToUpdate.gender = gender;
  if (job !== undefined) dataToUpdate.job = job;
  return await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
    select: {
      id: true,
      nickname: true,
      age: true,
      gender: true,
      job: true,
      email: true,
      avatarUrl: true
    }
  });
};

 /**
 * @param {number} 
 * @param {string}
 * @returns {Promise<Object>} 
 */
export const updateUserAvatar = async (userId, avatarPath) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: avatarPath },
    select: {
      id: true,
      nickname: true,
      avatarUrl: true
    }
  });
};