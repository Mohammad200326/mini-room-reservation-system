import { Booking } from 'generated/prisma/client';

export type CreateBookingDTO = Pick<Booking, 'roomId' | 'checkIn' | 'checkOut'>;

export type UpdateBookingDTO = Pick<Booking, 'status'>;

export type BookingResponseDTO = Booking;
