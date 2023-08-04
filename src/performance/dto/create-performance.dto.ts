import {
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';

class PerformanceDateTime {
  @IsString()
  seat_row: string;

  @IsString()
  date: string;

  @IsString()
  time: string;
}

export class CreatePerformanceDto {
  @IsNumber()
  perf_id: number;

  @IsNumber()
  User_id: number;

  @IsString()
  perf_name: string;

  @IsString()
  perf_description: string;

  @IsString()
  perf_category: string;

  @IsNumber()
  perf_price: number;

  @IsString()
  perf_address: string;

  @IsString()
  @IsOptional()
  perf_image?: string;

  @IsArray()
  @ValidateNested({ each: true })
  perf_date_time: PerformanceDateTime[];

  @IsOptional()
  created_At: Date;

  @IsOptional()
  updated_At: Date;
}
