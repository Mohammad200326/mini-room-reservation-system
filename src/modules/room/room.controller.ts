import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDTO, RoomResponseDTO, UpdateRoomDTO } from './dto/room.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  createRoomValidationSchema,
  updateRoomValidationSchema,
} from './util/room.vaildation.schema';
import { User } from 'src/decorators/user.decorator';
import { UserResponseDto } from '../auth/dto/auth.dto';
import { AuthGuard } from 'src/guards/auth.guard';
// import { Room } from 'generated/prisma/client';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body(new ZodValidationPipe(createRoomValidationSchema))
    createRoomDto: CreateRoomDTO,
    @User() user: UserResponseDto['user'],
  ): Promise<RoomResponseDTO> {
    return this.roomService.create(user.id, createRoomDto);
  }

  // @Get()
  // findAll() {
  //   return this.roomService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.roomService.findOne(+id);
  // }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @User() user: UserResponseDto['user'],
    @Body(new ZodValidationPipe(updateRoomValidationSchema))
    updateRoomDto: UpdateRoomDTO,
  ): Promise<RoomResponseDTO> {
    return this.roomService.update(user.id, id, updateRoomDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roomService.remove(+id);
  // }
}
