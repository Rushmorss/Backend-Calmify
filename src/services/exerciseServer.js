import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { id: 'asc' }, 
  });
};
export const getCategoryDetail = async (id) => {
  const categoryId = parseInt(id);
  
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      exercises: true,
    },
  });

  if (!category) throw new Error("Không tìm thấy phương pháp này");
  return category;
};
export const getExerciseDetail = async (id) => {
  const exerciseId = parseInt(id);
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
    include: { category: true },
  });
  if (!exercise) throw new Error("Không tìm thấy bài tập");
  const pool = await prisma.exercise.findMany({
    where: { id: { not: exerciseId } },
    take: 20,
    orderBy: { createdAt: 'desc' },
  });
  const shuffled = pool.sort(() => 0.5 - Math.random());
  const suggestions = shuffled.slice(0, 5);
  return { ...exercise, suggestions };
};