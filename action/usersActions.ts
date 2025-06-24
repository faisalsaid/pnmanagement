'use server ';

import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

// UPDATE user role

interface UpdateUserRoleInput {
  userId: string;
  role: Role;
}
export const updateUserRole = async ({ userId, role }: UpdateUserRoleInput) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return updatedUser;
  } catch (error) {
    console.error('❌ Failed to update user role:', error);
    throw new Error('Failed to update user role.');
  }
};
