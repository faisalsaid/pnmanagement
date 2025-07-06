import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});
export type SigninSchema = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase letter')
      .regex(/[a-z]/, 'Must contain lowercase letter')
      .regex(/[0-9]/, 'Must contain number')
      .regex(/[^A-Za-z0-9]/, 'Must contain special character')
      .max(32, 'Password cannot be longer than 32 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

// POST SCEMA
export const postFormSchema = z.object({
  authorId: z.string().min(1),
  title: z.string().min(3, 'Title must be most then 3 character'),
  slug: z.string().min(1),
  summary: z.string().optional(),
  content: z.string().min(1),
  categoryId: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'REVIEW', 'ARCHIVED']),
  tags: z.array(
    z.object({ id: z.string(), name: z.string(), slug: z.string() }),
  ),
  media: z.array(z.object({ id: z.string(), role: z.string() })),
});

// CATEGORY SCHEMA

export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Category must be more than 3 character' }),
  slug: z.string(),
});

// ASSET SCHEMA
export const addAssetSchema = z.object({
  title: z.string().optional(),
  caption: z.string().optional(),
  url: z.string().url(),
  public_id: z.string().optional(),
  secure_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  resource_type: z.string(),
  format: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  uploadedBy: z.string(),
});

// ASSET INFO SCHEMA
export const UpdateAssetInfoSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  caption: z.string().optional(),
});

// CREATE PROJECT SCHEMA

export const CreateProjectSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  deadline: z.string().optional(), // ISO Date string
  teamMembers: z
    .array(
      z.object({
        userId: z.string(),
        role: z.enum(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']),
      }),
    )
    .optional(),
});

// CREATE GOAL SHCEMA

export const GoalStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);

export const GoalFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  projectId: z.string(),
  createdById: z.string(),
});

export type GoalFormValues = z.infer<typeof GoalFormSchema>;

// CREATE task
export const TaskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
  dueDate: z.coerce.date().optional(),
  goalId: z.string().min(1, 'Goal is required'),
  assignedToId: z.string().min(1).optional(),
  createdById: z.string().min(1),
});

export type TaskFormValues = z.infer<typeof TaskFormSchema>;
