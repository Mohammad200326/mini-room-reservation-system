import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDTO, RoomResponseDTO, UpdateRoomDTO } from './dto/room.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  createRoomValidationSchema,
  updateRoomValidationSchema,
} from './util/room.validation.schema';
import { User } from 'src/decorators/user.decorator';
import { UserResponseDto } from '../auth/dto/auth.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @Roles(['ADMIN', 'OWNER'])
  create(
    @Body(new ZodValidationPipe(createRoomValidationSchema))
    createRoomDto: CreateRoomDTO,
    @User() user: UserResponseDto['user'],
  ): Promise<RoomResponseDTO> {
    return this.roomService.create(user.id, createRoomDto);
  }

  @Get()
  findAll(): Promise<RoomResponseDTO[]> {
    return this.roomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @Roles(['ADMIN', 'OWNER'])
  update(
    @Param('id') id: string,
    @User() user: UserResponseDto['user'],
    @Body(new ZodValidationPipe(updateRoomValidationSchema))
    updateRoomDto: UpdateRoomDTO,
  ): Promise<RoomResponseDTO> {
    return this.roomService.update(user.id, id, updateRoomDto);
  }

  @Get('owner/:ownerId')
  @Roles(['ADMIN', 'OWNER'])
  findByOwnerId(
    @Param('ownerId') ownerId: string,
    @User() user: UserResponseDto['user'],
  ): Promise<RoomResponseDTO[]> {
    return this.roomService.getRoomsByOwnerId(user, ownerId);
  }
}
