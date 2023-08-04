import { IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  User_id: number;

  @IsNumber()
  Seat_id: number;

  @IsNumber()
  Perfd_id: number;

  @IsNumber()
  price: number;
}
