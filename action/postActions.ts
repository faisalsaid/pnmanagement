'use server';
import prisma from '@/lib/prisma';
import { CreateCategorySchema, postFormSchema } from '@/lib/zod';
import { revalidatePath } from 'next/cache';
import slugify from 'slugify';
import { z } from 'zod';

interface InputCategory {
  name: string;
  slug: string;
}

export const createCategory = async (payload: InputCategory) => {
  const validatedField = CreateCategorySchema.safeParse(payload);

  if (!validatedField.success) {
    return {
      error: validatedField.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.category.create({
      data: {
        name: payload.name,
        slug: payload.slug,
      },
    });
  } catch (error) {
    console.log(error);

    return { message: 'Failed create category' };
  }

  revalidatePath('/settings'); // agar list reload di server
  return { success: true };
};

export const getAllCategory = async () => {
  try {
    const categories = await prisma.category.findMany();
    return { success: true, data: categories };
  } catch (error) {
    return { message: 'Can,t get categories', error };
  }
};

// Get all Tags
export async function getAllTags() {
  const tags = await prisma.tag.findMany({
    select: { id: true, name: true, slug: true },
  });

  return tags;
}

// HANDLE CREATE ARTICLE
export async function createArticle(data: z.infer<typeof postFormSchema>) {
  console.log('ACTION POST', data);

  const validated = postFormSchema.parse(data);

  const [author, category] = await Promise.all([
    prisma.user.findUnique({ where: { id: validated.authorId } }),
    prisma.category.findUnique({ where: { id: validated.categoryId } }),
  ]);

  if (!author) {
    return { message: 'Invalid authorId – user not found' };
  }

  if (!category) {
    return { message: 'Invalid categoryId – category not found' };
  }

  try {
    await prisma.article.create({
      data: {
        title: validated.title,
        slug: validated.slug,
        summary: validated.summary,
        content: validated.content,
        status: validated.status,
        categoryId: validated.categoryId,
        authorId: validated.authorId,
        publishedAt: validated.status === 'PUBLISHED' ? new Date() : undefined,

        tags: {
          create: validated.tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { name: tag.name },
                create: {
                  name: tag.name,
                  slug: slugify(tag.name, { lower: true }),
                },
              },
            },
          })),
        },

        media:
          validated.media.length > 0
            ? {
                create: validated.media.map((media) => ({
                  mediaAsset: {
                    connect: { id: media.id },
                  },
                  role: media.role,
                })),
              }
            : undefined,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('CREATE POST ERROR:', error);
    return {
      message: 'Failed to create post',
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
