'use server';

import { signIn } from '@/auth';
import prisma from '@/lib/prisma';
import {
  loginSchema,
  RegisterSchema,
  registerSchema,
  SigninSchema,
} from '@/lib/zod';
import { hashSync } from 'bcrypt-ts';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';

type SignupPorps = {
  data: RegisterSchema;
};

export const signupCredentials = async ({ data }: SignupPorps) => {
  // validated form field
  const validatedField = registerSchema.safeParse(data);

  if (!validatedField.success) {
    return {
      error: validatedField.error.flatten().fieldErrors,
    };
  }

  // Destructuring field
  const { name, email, password } = validatedField.data;

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

type SigninProps = {
  data: SigninSchema;
};

export const signinCredentials = async ({ data }: SigninProps) => {
  // console.log('signinCredentials =>>', data);

  // validated form field
  const validatedField = loginSchema.safeParse(data);
  if (!validatedField.success) {
    return {
      error: validatedField.error.flatten().fieldErrors,
    };
  }

  // Destructuring field
  const { email, password } = validatedField.data;

  // signin use authjs
  try {
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials' };
        default:
          return { message: 'Something went wrong' };
      }
    }
    throw error;
  }
};
