import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
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
} from './util/booking.vaildation.schema';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('booking')
@UseGuards(AuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(
    @User() user: UserResponseDto['user'],
    @Body(new ZodValidationPipe(createBookingValidationSchema))
    createBookingDto: CreateBookingDTO,
  ): Promise<BookingResponseDTO> {
    return this.bookingService.create(user.id, createBookingDto);
  }

  @Get()
  findByGuestId(
    @User() user: UserResponseDto['user'],
  ): Promise<BookingResponseDTO[]> {
    return this.bookingService.findBookingsByGuestId(user.id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.bookingService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @User() user: UserResponseDto['user'],
    @Body(new ZodValidationPipe(updateBookingValidationSchema))
    updateBookingDto: UpdateBookingDTO,
  ): Promise<BookingResponseDTO> {
    return this.bookingService.update(user.id, id, updateBookingDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.bookingService.remove(+id);
  // }
}
