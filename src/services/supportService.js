import prisma from "../config/prismaClient.js";

const getAllLocations = async (keyword) => {
  const whereClause = keyword
    ? {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { address: { contains: keyword, mode: 'insensitive' } },
        { phoneNumber: { contains: keyword, mode: 'insensitive' } },
        { note: { contains: keyword, mode: 'insensitive' } }
      ],
    }
    : {};

  return await prisma.supportLocation.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      address: true,
      phoneNumber: true,
      note: true,
      createdAt: true,
      supportType: {
        select: {
          id: true,
          name: true,
          image: true 
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getLocationById = async (id) => {
  return await prisma.supportLocation.findUnique({
    where: { id: String(id) },
    include: { supportType: true },
  });
};

const getSupportTypes = async () => {
  return await prisma.supportType.findMany();
};

const resolveSupportTypeId = async (typeInput) => {
  if (!typeInput && typeInput !== 0) return null;
  const s = String(typeInput);
  const byId = await prisma.supportType.findUnique({ where: { id: s } });
  if (byId) return byId.id;
  const byCode = await prisma.supportType.findFirst({ where: { code: s } });
  if (byCode) return byCode.id;
  const rows = await prisma.$queryRaw`
    SELECT id FROM support_types WHERE id = ${typeInput} OR id = ${s} OR code = ${s} LIMIT 1
  `;
  if (Array.isArray(rows) && rows.length > 0) return String(rows[0].id);

  return null;
};

const createLocation = async (data) => {
  const resolvedTypeId = await resolveSupportTypeId(data.typeId);
  if (!resolvedTypeId) {
    const err = new Error("Support type not found");
    err.code = "SUPPORT_TYPE_NOT_FOUND";
    throw err;
  }

  return await prisma.supportLocation.create({
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
      note: data.note,
      typeId: resolvedTypeId,
    },
  });
};

const updateLocation = async (id, data) => {
  let resolvedTypeId;
  if (data.typeId !== undefined && data.typeId !== null) {
    resolvedTypeId = await resolveSupportTypeId(data.typeId);
    if (!resolvedTypeId) {
      const err = new Error("Support type not found");
      err.code = "SUPPORT_TYPE_NOT_FOUND";
      throw err;
    }
  }

  return await prisma.supportLocation.update({
    where: { id: String(id) },
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
      note: data.note,
      typeId: resolvedTypeId ? resolvedTypeId : undefined,
    },
  });
};

const deleteLocation = async (id) => {
  return await prisma.supportLocation.delete({
    where: { id: String(id) },
  });
};
const adminGetAllLocations = async () => {
  return await prisma.supportLocation.findMany({
    include: {
      supportType: true 
    },
    orderBy: { id: 'asc' },
  });
};
export default {
  getAllLocations,
  getLocationById,
  getSupportTypes,
  createLocation,
  updateLocation,
  deleteLocation,
  adminGetAllLocations
};