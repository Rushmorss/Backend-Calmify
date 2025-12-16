import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcryptjs' 

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@calmify.com' },
    update: {},
    create: {
      email: 'admin@calmify.com',
      password: hashedPassword,
      role: 'ADMIN',
      nickname: 'Super Admin',
    },
  })
  console.log({ admin })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })