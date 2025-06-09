'use server';
import prisma from '@/lib/prisma';
import { CreateCategorySchema } from '@/lib/zod';
import { revalidatePath } from 'next/cache';

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
