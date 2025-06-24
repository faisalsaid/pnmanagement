import prisma from '@/lib/prisma';
import slugify from 'slugify';

const categories = [
  'Uncategorized',
  'Utama',
  'Politik',
  'Hukum',
  'Olahraga',
  'Hiburan',
  'Internasional',
  'Daerah',
];

async function seedCategories() {
  for (const name of categories) {
    const slug = slugify(name, {
      lower: true,
      strict: true, // delete non-url caracter
      trim: true,
    });

    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }

  console.log(`✅ Seeded ${categories.length} categories.`);
}

seedCategories()
  .catch((e) => {
    console.error('❌ Error seeding categories:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
