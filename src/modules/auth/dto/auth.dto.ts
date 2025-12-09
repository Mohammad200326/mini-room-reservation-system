import { User } from 'generated/prisma/client';

export type RegisterDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UserResponseDto = {
  token: string;
  user: Omit<User, 'password'>;
};

export type LoginDTO = {
  email: string;
  password: string;
};
