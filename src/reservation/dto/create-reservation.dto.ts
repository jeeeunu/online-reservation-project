import { IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  Perf_id: number;

  @IsNumber()
  User_id: number;

  @IsNumber()
  Seat_id: number;

  @IsNumber()
  Perfd_id: number;

  @IsNumber()
  price: number;
}
