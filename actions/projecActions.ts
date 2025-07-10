'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import {
  CreateProjectSchema,
  GoalFormSchema,
  GoalFormValues,
  TaskFormSchema,
  TaskFormValues,
} from '@/lib/zod';
import { MemberRole, Role } from '@prisma/client';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import {
  ProjectDetail,
  projectDetailQuery,
} from '@/app/(admin)/projects/project.type';
// import { Role } from '@prisma/client';

export async function validateAdminUser() {
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

  return user;
}

// CREATE Project
export async function createProject({
  payload,
}: {
  payload: z.infer<typeof CreateProjectSchema>;
}) {
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

    const parsed = CreateProjectSchema.safeParse(payload);
    if (!parsed.success) {
      throw new Error(`Invalid data: ${parsed.error.message}`);
    }

    const { name, description, deadline, teamMembers = [] } = parsed.data;

    // Map untuk memastikan tidak ada duplikat member
    const memberMap = new Map<string, { userId: string; role: any }>();

    // Tambahkan member dari payload
    for (const member of teamMembers) {
      memberMap.set(member.userId, {
        userId: member.userId,
        role: member.role,
      });
    }

    // Tambahkan creator sebagai OWNER jika belum ada
    if (!memberMap.has(user.id)) {
      memberMap.set(user.id, { userId: user.id, role: 'OWNER' });
    }

    const finalTeam = Array.from(memberMap.values());

    // Buat project dan sekaligus tambahkan team member
    const data = await prisma.project.create({
      data: {
        name,
        description: description || null,
        deadline: deadline ? new Date(deadline) : null,
        createdBy: { connect: { id: user.id } },
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

export const getAllProjects = async (userId?: string) => {
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

    const isPrivileged = ['ADMIN', 'PEMERED'].includes(dbUser.role);

    const projects = await prisma.project.findMany({
      where: isPrivileged
        ? {}
        : {
            members: {
              some: {
                userId: userId,
              },
            },
          },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        description: true,
        deadline: true,
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
        members: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        goals: {
          include: {
            tasks: {
              select: {
                id: true,
              },
            },
          },
        },
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
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    throw new Error('Unauthorized');
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role === 'USER') {
    throw new Error('Forbidden');
  }

  const project: ProjectDetail | null = await prisma.project.findUnique({
    where: { id },
    ...projectDetailQuery,
  });

  if (!project) return null;

  const goalsWithProgress = project.goals.map((goal) => {
    const totalTasks = goal.tasks.length;
    const doneTasks = goal.tasks.filter(
      (task) => task.status === 'DONE',
    ).length;

    const progress =
      totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

    return {
      ...goal,
      progress,
    };
  });

  return {
    ...project,
    goals: goalsWithProgress,
  };
};

// UPDATE single field by id

interface UpdateSingleFieldByIdProps {
  field: 'description' | 'name';
  data: string;
  id: string;
}

export const updateProjectSingleFieldById = async ({
  field,
  data,
  id,
}: UpdateSingleFieldByIdProps) => {
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

    // Validasi field yang diizinkan
    const allowedFields = ['description', 'name'];
    if (!allowedFields.includes(field)) {
      return { status: 'failed', message: 'Field not allowed' };
    }

    // Bangun data update secara dinamis
    const updateData: Record<string, any> = {};
    updateData[field] = data;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return { status: 'success', data: updatedProject };
  } catch (error: any) {
    return { status: 'error', message: error.message };
  }
};

// /actions/projectActions.ts
export async function addMembersToProject({
  projectId,
  members,
}: {
  projectId: string;
  members: { userId: string; role: MemberRole }[];
}) {
  console.log(projectId, members);

  try {
    if (!members.length) return { success: true }; // tidak ada yang perlu ditambahkan

    // Ambil anggota yang sudah ada
    const existingMembers = await prisma.teamMember.findMany({
      where: {
        projectId,
        userId: {
          in: members.map((m) => m.userId),
        },
      },
      select: { userId: true },
    });

    const existingUserIds = new Set(existingMembers.map((m) => m.userId));

    // Filter hanya user yang belum tergabung
    const newMembers = members.filter((m) => !existingUserIds.has(m.userId));

    if (newMembers.length === 0) {
      return { success: true, message: 'No new members to add' };
    }

    // Validasi semua userId ada di tabel User
    const validUsers = await prisma.user.findMany({
      where: {
        id: { in: newMembers.map((m) => m.userId) },
      },
      select: { id: true },
    });

    const validUserIds = new Set(validUsers.map((u) => u.id));

    const finalMembers = newMembers.filter((m) => validUserIds.has(m.userId));

    if (finalMembers.length === 0) {
      throw new Error('No valid users to add');
    }

    // Simpan ke database
    await prisma.$transaction(
      finalMembers.map((member) =>
        prisma.teamMember.create({
          data: {
            userId: member.userId,
            projectId,
            role: member.role,
          },
        }),
      ),
    );

    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to add members:', error);
    throw new Error('Error adding project members');
  }
}

export async function updateMemberRole({
  projectId,
  userId,
  role,
}: {
  projectId: string;
  userId: string;
  role: MemberRole;
}) {
  return await prisma.teamMember.update({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
    data: {
      role,
    },
  });
}

export async function removeProjectMember({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  return await prisma.teamMember.delete({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });
}

// POST create goals

export async function createGoal(formData: FormData) {
  // validate user
  await validateAdminUser();

  // 1. Parse & validate input
  const raw = Object.fromEntries(formData.entries());

  const result = GoalFormSchema.safeParse(raw);
  if (!result.success) {
    return { error: 'Invalid input', issues: result.error.flatten() };
  }

  const { title, description, dueDate, status, projectId, createdById } =
    result.data;

  try {
    // 2. Create goal in DB
    const result = await prisma.goal.create({
      data: {
        title,
        description,
        dueDate,
        status,
        projectId,
        createdById,
      },
    });

    return { success: true, result };
  } catch (err) {
    console.error('Failed to create goal', err);
    return { error: 'Server error. Please try again later.' };
  }
}

// UPDATE GOAL

export interface UpdateGoalParams extends GoalFormValues {
  id: string;
}

export async function updateGoal(data: UpdateGoalParams) {
  await validateAdminUser();

  const result = GoalFormSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      error: 'Invalid input',
      issues: result.error.flatten(),
    };
  }

  const { id, ...goalData } = data;

  try {
    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: goalData,
    });

    return { success: true, result: updatedGoal };
  } catch (error) {
    console.error('Failed to update goal:', error);
    return { success: false, error: 'Server error. Please try again later.' };
  }
}

// DELETE PROJECT GOAL

export async function deleteGoal(id: string) {
  try {
    // Pastikan user adalah admin
    await validateAdminUser();

    // Hapus goal
    await prisma.goal.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to delete goal:', error);
    return {
      success: false,
      error: 'Failed to delete goal. Please try again later.',
    };
  }
}

// CREATE Task

export async function createTask(formData: TaskFormValues) {
  await validateAdminUser();

  const result = TaskFormSchema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      error: 'Invalid input',
      issues: result.error.flatten(),
    };
  }

  const {
    title,
    description,
    status,
    dueDate,
    goalId,
    assignedToId,
    createdById,
  } = result.data;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description: description || undefined,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        goalId,
        assignedToId: assignedToId || undefined,
        createdById: createdById,
      },
    });

    return { success: true, result: task };
  } catch (error) {
    console.error('Create task error:', error);
    return { success: false, error: 'Server error' };
  }
}

// UPDATE Task

// export async function updateTask(id: string, formData: FormData) {
//   await validateAdminUser();

//   const raw = Object.fromEntries(formData.entries());
export async function updateTask(id: string, data: TaskFormValues) {
  await validateAdminUser();

  const result = TaskFormSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: 'Invalid input',
      issues: result.error.flatten(),
    };
  }

  const {
    title,
    description,
    status,
    dueDate,
    goalId,
    assignedToId,
    createdById,
  } = result.data;

  try {
    const updated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description: description || undefined,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        goalId,
        assignedToId: assignedToId || undefined,
        createdById,
      },
    });

    return { success: true, result: updated };
  } catch (error) {
    console.error('Update task error:', error);
    return { success: false, error: 'Server error' };
  }
}

// DELETE Task

export async function deleteTask(id: string) {
  await validateAdminUser();

  try {
    await prisma.task.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error('Delete task error:', error);
    return { success: false, error: 'Failed to delete task' };
  }
}

export const getTasksByProjectId = async (projectId: string) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        goal: {
          projectId,
        },
      },
      include: {
        goal: {
          select: {
            title: true,
          },
        },
        assignedTo: {
          include: {
            teamMemberships: {
              where: {
                projectId: projectId,
              },
              select: {
                role: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks;
  } catch (error) {
    console.error('Failed to fetch tasks by projectId:', error);
    return [];
  }
};

// /////////////////////////

// update colum

export async function updateTaskColumn(taskId: string, columnId: string) {
  await prisma.task.update({
    where: { id: taskId },
    data: { columnId },
  });
}

export async function createColumn({
  projectId,
  name,
}: {
  projectId: string;
  name: string;
}) {
  const newColumn = await prisma.kanbanColumn.create({
    data: {
      name,
      order: 0, // atau hitung berdasarkan jumlah kolom yang ada
      projectId,
    },
  });

  return newColumn;
}

// export const getColumByPojectId = async (someProjectId: string) => {
//   try {
//     const columnsDB = await prisma.kanbanColumn.findMany({
//       where: { projectId: someProjectId },
//       orderBy: { order: 'asc' }, // sesuai urutan drag & drop
//     });

//     if (columnsDB) {
//       const columns = columnsDB.map((col) => ({
//         id: col.id,
//         name: col.name,
//         tasks: [], // masih kosong
//       }));
//       return { success: true, columns };
//     } else {
//       return { success: false, message: "Can't find column" };
//     }
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };

export async function assignTaskToColumn(taskId: string, columnId: string) {
  return await prisma.task.update({
    where: { id: taskId },
    data: { columnId },
  });
}
