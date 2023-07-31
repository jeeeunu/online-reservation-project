// performance.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from '../entities/performance.entity';
import { PerformanceDetail } from '../entities/performanceDetail.entity';
import { CreatePerformanceDto } from './dto/create-performance.dto';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    @InjectRepository(PerformanceDetail)
    private performanceDetailRepository: Repository<PerformanceDetail>,
  ) {}

  async create(
    createdPerformance: CreatePerformanceDto,
  ): Promise<{ message: string; data: CreatePerformanceDto } | undefined> {
    const { perf_date_time } = createdPerformance; // 입력된 데이터에서 'perf_date_time' 추출

    // Performance 데이터 생성
    const savedPerformance = await this.performanceRepository.save(
      createdPerformance,
    );

    // PerformanceDetail 데이터 생성
    const savedDetails: PerformanceDetail[] = await Promise.all(
      perf_date_time.map((dateTime) => {
        const detail = new PerformanceDetail();
        detail.Perf_id = savedPerformance.perf_id;
        detail.date = dateTime.date;
        detail.time = dateTime.time;
        return this.performanceDetailRepository.save(detail);
      }),
    );

    savedPerformance.details = savedDetails; // Performance의 'details' 속성을 저장된 PerformanceDetail 객체들로 설정합니다.
    delete savedPerformance['perf_date_time'];
    return {
      message: '공연 등록이 완료되었습니다',
      data: savedPerformance,
    };
  }
}
