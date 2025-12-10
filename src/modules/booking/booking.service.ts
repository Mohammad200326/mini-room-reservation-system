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

  findBookingsByGuestId(guestId: string) {
    return this.prismaService.booking.findMany({
      where: { guestId },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} booking`;
  // }

  async update(
    guestId: string,
    bookingId: string,
    updateBookingDto: UpdateBookingDTO,
  ) {
    const booking = await this.prismaService.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.guestId !== guestId)
      throw new ForbiddenException('You cannot update this booking');

    return await this.prismaService.booking.update({
      where: { id: bookingId },
      data: updateBookingDto,
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} booking`;
  // }
}
