'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { CreateProjectSchema } from '@/lib/zod';
// import { Role } from '@prisma/client';

// CREATE Project
export async function createProject({
  payload,
}: {
  payload: z.infer<typeof CreateProjectSchema>;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized: User not authenticated');
    }

    const parsed = CreateProjectSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Invalid data: ${parsed.error.message}`);
    }

    const {
      name,
      description,
      ownerId,
      deadline,
      teamMembers = [],
    } = parsed.data;

    // Validasi owner
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { role: true },
    });

    if (!owner) throw new Error('Invalid owner: User not found');
    if (owner.role === 'USER' || owner.role === 'TESTER') {
      throw new Error('Invalid owner: Must have elevated privileges');
    }

    // Gabungkan creator & owner ke teamMembers (hindari duplikat)
    const allMembersMap = new Map<string, { userId: string; role: any }>();
    teamMembers.forEach((m) => allMembersMap.set(m.userId, m));

    allMembersMap.set(ownerId, { userId: ownerId, role: 'OWNER' });
    if (ownerId !== session.user.id) {
      allMembersMap.set(session.user.id, {
        userId: session.user.id,
        role: 'ADMIN',
      });
    }

    const finalTeam = Array.from(allMembersMap.values());

    // Buat project dan sekaligus tambahkan team member
    const data = await prisma.project.create({
      data: {
        name,
        description: description || null,
        deadline: deadline ? new Date(deadline) : null,
        createdBy: { connect: { id: session.user.id } },
        owner: { connect: { id: ownerId } },
        members: {
          create: finalTeam.map((member) => ({
            user: { connect: { id: member.userId } },
            role: member.role,
          })),
        },
      },
    });

    revalidatePath('/projects');
    return { success: true, message: 'Project created successfully', data };
  } catch (error) {
    console.error('Project creation error:', error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to create project',
    };
  }
}

export const getUserToOwnerProject = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('Unauthorized: User not authenticated');
    }

    const users = await prisma.user.findMany({
      where: {
        role: {
          notIn: ['USER', 'TESTER'],
        },
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        image: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return users;
  } catch (error) {
    console.error('Failed to get project owners:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to retrieve eligible project owners',
    );
  }
};

// HENDLE GET ALL PROJECT

export const getAllProjects = async () => {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) throw new Error('Unauthorized');

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser || dbUser.role === 'USER') {
      throw new Error('Forbidden: Access denied');
    }

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        description: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true,
            articles: {
              select: {
                id: true,
              },
            },
          },
        },
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            image: true,
            articles: {
              select: {
                id: true,
              },
            },
          },
        },
        // Tambahkan field lain jika diperlukan
      },
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to load projects',
    );
  }
};

// GET projcet by id

interface GetPorjectById {
  id: string;
}

export const getProjectById = async ({ id }: GetPorjectById) => {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) throw new Error('Unauthorized');

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser || dbUser.role === 'USER') {
      throw new Error('Forbidden: Access denied');
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    return project;
  } catch (error) {}
};
