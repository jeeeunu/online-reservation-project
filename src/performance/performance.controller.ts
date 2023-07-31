// performance.controller.ts
import { Controller, Post, Body, Request } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomRequest } from '../interfaces/custom-request.interface';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  // 공연 등록
  @Post()
  async createPerformance(
    @Body() perf: CreatePerformanceDto,
    @Request() req: CustomRequest,
  ): Promise<{ message: string; data: CreatePerformanceDto }> {
    try {
      const userPayload = req.user;

      // 검사 : 관리자 로그인
      if (!userPayload.isAdmin) {
        throw new HttpException(
          '공연 관리자로 로그인해주세요',
          HttpStatus.FORBIDDEN,
        );
      }

      // 검사 : 필수 항목 입력 여부
      if (
        !perf.perf_name ||
        !perf.perf_description ||
        !perf.perf_category ||
        !perf.perf_price ||
        !perf.perf_address ||
        !perf.perf_image ||
        !perf.created_At ||
        !perf.updated_At ||
        !perf.perf_date_time ||
        perf.perf_date_time.length === 0
      ) {
        throw new HttpException(
          '필수 항목 데이터를 확인해주세요.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 검사 : 공연 50,000p 초과 여부
      if (perf.perf_price > 50000) {
        throw new HttpException(
          '공연예매 금액은 50,000p를 넘길수 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.performanceService.create(perf);
    } catch {
      throw new HttpException(
        '필수 항목 데이터를 확인해주세요.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
