import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  loginValidationSchema,
  registerValidationSchema,
} from './util/auth.validation.schema';
import type { RegisterDTO, UserResponseDto, LoginDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(
    @Body(new ZodValidationPipe(registerValidationSchema))
    registerDTO: RegisterDTO,
  ): Promise<UserResponseDto> {
    const createdUser = await this.authService.register(registerDTO);
    return createdUser;
  }

  @Post('login')
  login(
    @Body(new ZodValidationPipe(loginValidationSchema)) loginDTO: LoginDTO,
  ): Promise<UserResponseDto> {
    return this.authService.login(loginDTO);
  }
}
