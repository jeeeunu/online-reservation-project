// performance.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomRequest } from '../interfaces/custom-request.interface';
import { PerformanceService } from './performance.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { performanceInterface } from './interfaces/performance.interface';
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  //-- 공연 등록 --//
  @Post()
  async createPerformance(
    @Body() perf: CreatePerformanceDto,
    @Request() req: CustomRequest,
  ): Promise<{ message: string; data: performanceInterface }> {
    try {
      const userPayload = req.user;

      // 검사 : 관리자 로그인
      if (!req.user || !userPayload.isAdmin) {
        throw new HttpException('공연 관리자로 로그인 후 진행해주세요', HttpStatus.FORBIDDEN);
      }

      // 검사 : 필수 항목 입력 여부
      if (
        !perf.perf_name ||
        !perf.perf_description ||
        !perf.perf_category ||
        !perf.perf_price ||
        !perf.perf_address ||
        !perf.perf_image ||
        !perf.perf_date_time ||
        perf.perf_date_time.length === 0
      ) {
        throw new HttpException('필수 항목 데이터를 확인해주세요.', HttpStatus.BAD_REQUEST);
      }

      // 검사 : 공연 50,000p 초과 여부
      if (perf.perf_price > 50000) {
        throw new HttpException(
          '공연예매 금액은 50,000p를 넘길수 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.performanceService.create(userPayload, perf);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  //-- 공연 전체조회 --//
  @Get()
  async Performance(): Promise<performanceInterface[]> {
    return this.performanceService.getAll();
  }

  //-- 공연 검색 --//
  @Get('/search')
  async PerformanceSearch(
    @Query('performanceName') performanceName: string,
  ): Promise<performanceInterface[]> {
    return await this.performanceService.getSearchResult(performanceName);
  }

  //-- 공연 상세보기 --//
  @Get('/detail/:performanceId')
  async getPerformanceDetail(
    @Param('performanceId') performanceId: number,
  ): Promise<performanceInterface> {
    return await this.performanceService.getPerformanceDetail(performanceId);
  }
}
