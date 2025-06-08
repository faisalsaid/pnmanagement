import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});
export type SigninSchema = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      // .regex(/[A-Z]/, 'Must contain uppercase letter')
      // .regex(/[a-z]/, 'Must contain lowercase letter')
      // .regex(/[0-9]/, 'Must contain number')
      // .regex(/[^A-Za-z0-9]/, 'Must contain special character')
      .max(32, 'Password cannot be longer than 32 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
