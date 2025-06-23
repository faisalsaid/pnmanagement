import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hashSync } from 'bcrypt-ts';

const prisma = new PrismaClient();

export async function seedUsers(count = 10) {
  const hashedPassword = hashSync(process.env.TESTER_PASSWORD as string, 10);

  const users = Array.from({ length: count }).map(() => {
    const name = faker.person.fullName();
    const email = faker.internet
      .email({
        firstName: name.split(' ')[0],
        lastName: name.split(' ').at(-1),
      })
      .toLowerCase();

    return { name, email, hashedPassword };
  });

  await Promise.all(
    users.map(({ name, email, hashedPassword }) =>
      prisma.user.upsert({
        where: { email },
        update: {}, // kalau mau update field lain tulis di sini
        create: { name, email, hashPassword: hashedPassword },
      }),
    ),
  );

  console.log(`✅  Seeded ${count} users`);
}

if (require.main === module) {
  // dipanggil via "node/tsx prisma/seed/user.seed.ts 25"
  seedUsers(Number(process.argv[2]) || 10)
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
