import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  ForbiddenException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import {
  BookingResponseDTO,
  CreateBookingDTO,
  UpdateBookingDTO,
} from './dto/booking.dto';
import { UserResponseDto } from '../auth/dto/auth.dto';
import { User } from 'src/decorators/user.decorator';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  createBookingValidationSchema,
  updateBookingValidationSchema,
} from './util/booking.validation.schema';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(['ADMIN', 'GUEST'])
  create(
    @User() user: UserResponseDto['user'],
    @Body(new ZodValidationPipe(createBookingValidationSchema))
    createBookingDto: CreateBookingDTO,
  ): Promise<BookingResponseDTO> {
    return this.bookingService.create(user.id, createBookingDto);
  }

  @Get()
  @Roles(['ADMIN', 'GUEST'])
  findByGuestId(
    @User() user: UserResponseDto['user'],
  ): Promise<BookingResponseDTO[]> {
    return this.bookingService.findBookingsByGuestId(user.id);
  }

  @Get(':id')
  @Roles(['ADMIN', 'GUEST'])
  async findOne(
    @Param('id') id: string,
    @User() user: UserResponseDto['user'],
  ) {
    const booking = await this.bookingService.findById(id);

    if (booking?.guestId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You cannot view this booking');
    }

    return booking;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @User() user: UserResponseDto['user'],
    @Body(new ZodValidationPipe(updateBookingValidationSchema))
    updateBookingDto: UpdateBookingDTO,
  ): Promise<BookingResponseDTO> {
    return this.bookingService.update(user.id, id, updateBookingDto);
  }
}
