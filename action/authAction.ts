'use server';

import prisma from '@/lib/prisma';
import { RegisterSchema, registerSchema } from '@/lib/zod';
import { hashSync } from 'bcrypt-ts';
import { redirect } from 'next/navigation';

type SignupPorps = {
  data: RegisterSchema;
};

export const signupCredentials = async ({ data }: SignupPorps) => {
  // validated form field
  const validatedVield = registerSchema.safeParse(data);

  if (!validatedVield.success) {
    return {
      error: validatedVield.error.flatten().fieldErrors,
    };
  }

  // Destructuring field
  const { name, email, password } = validatedVield.data;

  // hash password
  const hashPassword = hashSync(password, 10);

  // console.log(name, email, password, hashPassword);

  // Block mutated db create user
  try {
    await prisma.user.create({
      data: {
        name,
        email,
        hashPassword,
      },
    });
  } catch (error) {
    console.error('User creation failed:', error);
    return { error: 'Failed to create user. Email might already be taken.' };
  }
  redirect('/auth/login');
};
