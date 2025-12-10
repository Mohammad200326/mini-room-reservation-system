import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDTO, UpdateBookingDTO } from './dto/booking.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BookingService {
  constructor(private prismaService: DatabaseService) {}
  create(guestId: string, createBookingDto: CreateBookingDTO) {
    return this.prismaService.booking.create({
      data: {
        ...createBookingDto,
        guestId,
      },
    });
  }

  findById(id: string) {
    return this.prismaService.booking.findUnique({
      where: { id },
      include: {
        room: true,
        guest: true,
      },
    });
  }

  async findBookingsByGuestId(guestId: string) {
    const booking = await this.prismaService.booking.findMany({
      where: { guestId },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    return booking;
  }

  async update(
    guestId: string,
    bookingId: string,
    updateBookingDto: UpdateBookingDTO,
  ) {
    const booking = await this.findById(bookingId);

    if (booking!.guestId !== guestId)
      throw new ForbiddenException('You cannot update this booking');

    return await this.prismaService.booking.update({
      where: { id: bookingId },
      data: updateBookingDto,
    });
  }
}
