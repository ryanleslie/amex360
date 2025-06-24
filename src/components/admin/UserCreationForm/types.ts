
import * as z from 'zod';

export const userCreationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  passwordSuffix: z.string().min(1, 'Password suffix is required'),
  emailPrefix: z.string().min(1, 'Email prefix is required'),
  displayName: z.string().min(1, 'Display name is required'),
  firstName: z.string().min(1, 'First name is required'),
});

export type UserCreationFormData = z.infer<typeof userCreationSchema>;
