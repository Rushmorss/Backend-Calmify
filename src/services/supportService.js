import prisma from "../config/prismaClient.js";

const getAllLocations = async (keyword) => {
  const whereClause = keyword
    ? {
        OR: [
          { name: { contains: keyword } }, 
          { address: { contains: keyword } }, 
          { phoneNumber: { contains: keyword } }, 
          { note: { contains: keyword } }
        ],
      }
    : {};

  return await prisma.supportLocation.findMany({
    where: whereClause,
    include: { supportType: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getLocationById = async (id) => {
  return await prisma.supportLocation.findUnique({
    where: { id: parseInt(id) },
    include: { supportType: true },
  });
};

const getSupportTypes = async () => {
  return await prisma.supportType.findMany();
};

const createLocation = async (data) => {
  return await prisma.supportLocation.create({
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
      note: data.note,
      typeId: parseInt(data.typeId),
    },
  });
};

const updateLocation = async (id, data) => {
  return await prisma.supportLocation.update({
    where: { id: parseInt(id) },
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
      note: data.note,
      typeId: data.typeId ? parseInt(data.typeId) : undefined,
    },
  });
};

const deleteLocation = async (id) => {
  return await prisma.supportLocation.delete({
    where: { id: parseInt(id) },
  });
};

export default {
    getAllLocations,
    getLocationById, 
    getSupportTypes,
    createLocation,
    updateLocation,
    deleteLocation
};