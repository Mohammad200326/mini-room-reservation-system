import { userValidationSchema } from 'src/modules/user/util/user.validation.schema';
import { ZodType } from 'zod';
import { LoginDTO } from '../dto/auth.dto';

export const registerValidationSchema = userValidationSchema;

export const loginValidationSchema = userValidationSchema.pick({
  email: true,
  password: true,
}) satisfies ZodType<LoginDTO>;
