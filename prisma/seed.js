const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { email: 'admin@eventsync.com' },
    update: {},
    create: { email: 'admin@eventsync.com', password: hashedPassword },
  })
  console.log('Admin créé : admin@eventsync.com / admin123')
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())