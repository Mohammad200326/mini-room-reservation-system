import { Injectable } from '@nestjs/common';
import { RegisterDTO } from '../auth/dto/auth.dto';
import { DatabaseService } from '../database/database.service';
import { User } from 'generated/prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: DatabaseService) {}

  create(registerDTO: RegisterDTO) {
    return this.prismaService.user.create({
      data: registerDTO,
    });
  }

  findAll(): Promise<Omit<User, 'password'>[]> {
    const users = this.prismaService.user.findMany({
      omit: {
        password: true,
      },
    });
    return users;
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
