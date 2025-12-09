import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO, RegisterDTO, UserResponseDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { Role } from 'generated/prisma/enums';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async register(registerDTO: RegisterDTO): Promise<UserResponseDto> {
    const hashedPassword = await this.hashPassword(registerDTO.password);
    const createdUser = await this.userService.create({
      ...registerDTO,
      password: hashedPassword,
      role: 'GUEST',
    });

    const token = this.generateJwtToken(createdUser.id, createdUser.role);

    return {
      token,
      user: createdUser,
    };
  }

  async login(loginDTO: LoginDTO): Promise<UserResponseDto> {
    const foundUser = await this.userService.findByEmail(loginDTO.email);

    if (!foundUser) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await this.verifyPassword(
      loginDTO.password,
      foundUser.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = this.generateJwtToken(foundUser.id, foundUser.role);

    return {
      token,
      user: foundUser,
    };
  }

  private hashPassword(password: string) {
    return argon.hash(password);
  }

  private verifyPassword(password: string, hashedPassword: string) {
    return argon.verify(hashedPassword, password);
  }

  private generateJwtToken(userId: string, role: Role) {
    return this.jwtService.sign(
      { sub: String(userId), role },
      {
        expiresIn: '30d',
      },
    );
  }
}
