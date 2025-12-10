import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDTO, UpdateRoomDTO } from './dto/room.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RoomService {
  constructor(private prismaService: DatabaseService) {}
  create(ownerId: string, createRoomDto: CreateRoomDTO) {
    return this.prismaService.room.create({
      data: {
        ...createRoomDto,
        ownerId,
      },
    });
  }

  // findAll() {
  //   return `This action returns all room`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} room`;
  // }

  async update(ownerId: string, roomId: string, updateRoomDto: UpdateRoomDTO) {
    const room = await this.prismaService.room.findUnique({
      where: { id: roomId },
    });

    if (!room) throw new NotFoundException('Room not found');

    if (room.ownerId !== ownerId)
      throw new ForbiddenException('You are not allowed to update this room');

    return this.prismaService.room.update({
      where: { id: roomId },
      data: updateRoomDto,
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} room`;
  // }
}
