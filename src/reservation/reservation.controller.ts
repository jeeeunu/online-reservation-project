import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CustomRequest } from '../interfaces/custom-request.interface';
import { reservationInterface } from './interfaces/reservation.interface';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  //-- 공연 예매 --//
  @Post(':Perf_id')
  async createReservation(
    @Param('Perf_id') Perf_id: string, // 밑에 숫자로 다시 변경(route 파라밑터는 그 값이 항상 문자열로 처리됨/하단에 숫자로 변환시켜줌)
    @Body() reservation: CreateReservationDto,
    @Request() req: CustomRequest,
  ): Promise<{ message: string; data: reservationInterface }> {
    const userPayload = req.user;

    if (!reservation.Seat_id || !reservation.price || !reservation.Perfd_id) {
      throw new HttpException(
        '필수 항목 데이터를 확인해주세요.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!userPayload.user_id) {
      throw new HttpException(
        '유저 정보가 확인되지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    reservation.Perf_id = parseInt(Perf_id, 10);
    reservation.User_id = userPayload.user_id;

    return this.reservationService.create(reservation);
  }

  //-- 예매 현황 --//
  @Get()
  async getReservation(
    @Request() req: CustomRequest,
  ): Promise<reservationInterface[]> {
    const userPayload = req.user;
    const user_id = userPayload.user_id;

    return this.reservationService.getAll(user_id);
  }
}
