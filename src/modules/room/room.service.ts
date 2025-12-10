import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDTO, UpdateRoomDTO } from './types/room.dto';
import { DatabaseService } from '../database/database.service';
import { UserResponseDto } from '../auth/dto/auth.dto';
import { Prisma } from 'generated/prisma/client';

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

  findAll(filters: {
    minPrice?: number;
    maxPrice?: number;
    minCapacity?: number;
    maxCapacity?: number;
  }) {
    const where: Prisma.RoomWhereInput = {};

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    if (
      filters.minCapacity !== undefined ||
      filters.maxCapacity !== undefined
    ) {
      where.capacity = {};
      if (filters.minCapacity !== undefined)
        where.capacity.gte = filters.minCapacity;
      if (filters.maxCapacity !== undefined)
        where.capacity.lte = filters.maxCapacity;
    }

    return this.prismaService.room.findMany({
      where,
      orderBy: { price: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prismaService.room.findUniqueOrThrow({
      where: { id },
    });
  }

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

  getRoomsByOwnerId(user: UserResponseDto['user'], ownerId: string) {
    if (user.role !== 'ADMIN' && user.id !== ownerId) {
      throw new ForbiddenException('You cannot access rooms of another owner');
    }
    return this.prismaService.room.findMany({
      where: { ownerId },
      include: {
        bookings: true,
      },
    });
  }
}
