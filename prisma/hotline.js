import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Đang bắt đầu seeding dữ liệu...');
  await prisma.supportLocation.deleteMany({});
  await prisma.supportType.deleteMany({});
  const yTe = await prisma.supportType.create({
    data: {
      name: 'Y tế',
      code: 'YTE',
      description: 'Các trạm y tế, bệnh viện và trung tâm tiêm chủng',
    },
  });

  const thựcPham = await prisma.supportType.create({
    data: {
      name: 'Thực phẩm',
      code: 'THUCPHAM',
      description: 'Các điểm phát nhu yếu phẩm và siêu thị 0 đồng',
    },
  });

  await prisma.supportLocation.createMany({
    data: [
      {
        name: 'Trạm Y Tế Phường A',
        phoneNumber: '0281234567',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        note: 'Trực 24/7',
        typeId: yTe.id, 
      },
      {
        name: 'Siêu Thị 0 Đồng - Cơ sở 1',
        phoneNumber: '0909999888',
        address: '456 Đường XYZ, Quận Bình Thạnh',
        note: 'Mở cửa từ 8h sáng đến 17h chiều',
        typeId: thựcPham.id,
      },
    ],
  });

  console.log('Seeding dữ liệu thành công!');
}
main()
  .catch((e) => {
    console.error('Lỗi khi seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });