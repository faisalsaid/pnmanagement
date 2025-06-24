import prisma from '@/lib/prisma';
import slugify from 'slugify';
import { faker } from '@faker-js/faker';
import { Role } from '@prisma/client';

const args = process.argv.slice(2);
const NUM_ARTICLES = parseInt(args[0], 10) || 10;

async function seedArticles() {
  const categories = await prisma.category.findMany();
  const authors = await prisma.user.findMany({
    where: {
      role: { in: ['PEMRED', 'REDAKTUR', 'REPORTER'] as Role[] },
    },
  });

  if (categories.length === 0 || authors.length === 0) {
    console.error('❌ Tidak ada kategori atau penulis yang valid.');
    process.exit(1);
  }

  for (let i = 0; i < NUM_ARTICLES; i++) {
    const title = faker.lorem.sentence(6);
    const slug = slugify(title, { lower: true, strict: true });
    const summary = faker.lorem.paragraph();
    const content = faker.lorem.paragraphs(5, '\n\n');

    const category = faker.helpers.arrayElement(categories);
    const author = faker.helpers.arrayElement(authors);

    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        title,
        slug,
        summary,
        content,
        authorId: author.id,
        categoryId: category.id,
        status: 'PUBLISHED',
        publishedAt: faker.date.recent({ days: 30 }),
        wordCount: content.split(/\s+/).length,
        viewCount: faker.number.int({ min: 0, max: 500 }),
      },
    });
  }

  console.log(`✅ Seeded ${NUM_ARTICLES} articles.`);
}

seedArticles()
  .catch((e) => {
    console.error('❌ Error seeding articles:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
