import { RoomStatus } from 'generated/prisma/enums';
import z, { ZodType } from 'zod';
import { CreateRoomDTO, UpdateRoomDTO } from '../types/room.dto';

export const createRoomValidationSchema = z.object({
  name: z.string().min(2).max(100),
  status: z.enum([RoomStatus.ACTIVE, RoomStatus.INACTIVE]),
  capacity: z.number().int().min(1),
  price: z.number().int().min(0),
}) satisfies ZodType<CreateRoomDTO>;

export const updateRoomValidationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  status: z.enum([RoomStatus.ACTIVE, RoomStatus.INACTIVE]).optional(),
  capacity: z.number().int().min(1).optional(),
  price: z.number().int().min(0).optional(),
}) satisfies ZodType<UpdateRoomDTO>;
