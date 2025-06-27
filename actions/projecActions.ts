// app/project/actions.ts
'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/prisma';
import { CreateProjectSchema } from '@/lib/zod';
import { log } from 'node:console';

interface CreateProjcetProps {
  name: string;
  description: string | undefined;
  ownerId: string;
}

export async function createProject({
  payload,
}: {
  payload: CreateProjcetProps;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const parsed = CreateProjectSchema.safeParse(payload);
  if (!parsed.success) throw new Error('Invalid data');

  const { name, description, ownerId } = parsed.data;

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        createdById: session.user.id,
        ownerId,
      },
    });

    revalidatePath('/projects');
    return newProject;
  } catch (error) {
    console.log(error);
    return { message: 'Failed create Projects' };
  }
}
