import prisma from '../config/prismaClient.js'; 
// --- USER FEATURES ---
export const getAllCategories = async () => {
  return await prisma.exerciseCategory.findMany({
    include: { _count: { select: { exercises: true } } }
  });
};

export const getCategoryWithExercises = async (categoryId) => {
  return await prisma.exerciseCategory.findUnique({
    where: { id: parseInt(categoryId) },
    include: {
      exercises: {
        select: { id: true, title: true, thumbnail: true, videoUrl: true, description: true }
      }
    }
  });
};

export const getExerciseDetail = async (exerciseId) => {
  const id = parseInt(exerciseId);
  const currentExercise = await prisma.exercise.findUnique({
    where: { id: id },
    include: { category: true }
  });

  if (!currentExercise) throw new Error('Exercise not found');

  const suggestions = await prisma.exercise.findMany({
    where: {
      categoryId: currentExercise.categoryId,
      id: { not: id }
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  return { data: currentExercise, suggestions };
};

// --- ADMIN FEATURES ---
export const createCategory = async (data) => {
  return await prisma.exerciseCategory.create({ data });
};

export const updateCategory = async (id, data) => {
  return await prisma.exerciseCategory.update({
    where: { id: parseInt(id) },
    data
  });
};

export const deleteCategory = async (id) => {
  return await prisma.exerciseCategory.delete({
    where: { id: parseInt(id) }
  });
};

export const createExercise = async (data) => {
  return await prisma.exercise.create({
    data: {
      title: data.title,
      description: data.description,
      instruction: data.instruction,
      videoUrl: data.videoUrl,
      thumbnail: data.thumbnail,
      categoryId: parseInt(data.categoryId)
    }
  });
};

export const updateExercise = async (id, data) => {
  return await prisma.exercise.update({
    where: { id: parseInt(id) },
    data
  });
};

export const deleteExercise = async (id) => {
  return await prisma.exercise.delete({
    where: { id: parseInt(id) }
  });
};