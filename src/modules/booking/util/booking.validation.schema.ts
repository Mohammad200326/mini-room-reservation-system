import z, { ZodType } from 'zod';
import { CreateBookingDTO, UpdateBookingDTO } from '../dto/booking.dto';
import { BookingStatus } from 'generated/prisma/enums';

export const createBookingValidationSchema = z.object({
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  roomId: z.string(),
}) satisfies ZodType<CreateBookingDTO>;

export const updateBookingValidationSchema = z.object({
  status: z.enum([BookingStatus.CONFIRMED, BookingStatus.CANCELLED]),
}) satisfies ZodType<UpdateBookingDTO>;
