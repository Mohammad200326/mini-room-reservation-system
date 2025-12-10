import { Room } from 'generated/prisma/client';

export type CreateRoomDTO = Pick<
  Room,
  'name' | 'price' | 'capacity' | 'status'
>;

export type UpdateRoomDTO = Partial<
  Pick<Room, 'name' | 'price' | 'capacity' | 'status'>
>;

export type RoomResponseDTO = Room;
