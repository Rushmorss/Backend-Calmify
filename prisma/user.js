import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; 
const prisma = new PrismaClient();
async function main() {
  const hashedPassword = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@calmify.com' },
    update: {},
    create: {
      email: 'admin@calmify.com',
      password: hashedPassword,
      role: 'admin',
      age: 30,
    },
  });
  console.log('Đã tạo tài khoản Admin mẫu:', admin.email);
}
main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());