// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt-ts';

const prisma = new PrismaClient();

async function main() {
  // Ambil dari .env
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL dan ADMIN_PASSWORD harus ada di .env');
  }

  // Hash password
  const hashPassword = hashSync(password, 10);

  // Upsert user
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Administrator',
      email,
      hashPassword,
      role: 'ADMIN',
    },
  });

  // Upsert category
  await prisma.category.upsert({
    where: { slug: 'uncategories' },
    update: {},
    create: {
      name: 'Uncategories',
      slug: 'uncategories',
    },
  });

  console.log('✅ Seed selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
