import { Role } from 'generated/prisma/enums';
import { RegisterDTO } from 'src/modules/auth/dto/auth.dto';
import z, { ZodType } from 'zod';

export const userValidationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email().toLowerCase(),
  password: z.string().min(6).max(100),
  role: z.enum([Role.ADMIN, Role.OWNER, Role.GUEST]),
}) satisfies ZodType<RegisterDTO>;
