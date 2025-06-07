import { object, string } from 'zod';

export const signInSchema = object({
  name: string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .min(3, 'Name must be more than 8 characters'),
  email: string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  confirmPassword: string({ required_error: 'Password is required' }).min(
    1,
    'Please confirm your password',
  ),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});
