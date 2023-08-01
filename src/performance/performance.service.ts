// performance.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from '../entities/performance.entity';
import { Seat } from '../entities/seat.entity';
import { Like } from 'typeorm';
import { PerformanceDetail } from '../entities/performanceDetail.entity';
import { CreatePerformanceDto } from './dto/create-performance.dto';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,
    @InjectRepository(PerformanceDetail)
    private performanceDetailRepository: Repository<PerformanceDetail>,
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}

  //-- 공연 등록 --//
  async create(
    createdPerformance: CreatePerformanceDto,
  ): Promise<{ message: string; data: CreatePerformanceDto } | undefined> {
    const { perf_date_time } = createdPerformance;

    // Performance 데이터 생성
    const savedPerformance = await this.performanceRepository.save(
      createdPerformance,
    );

    const savedDetails = await Promise.all(
      perf_date_time.map(async (dateTime) => {
        const detail = new PerformanceDetail();
        detail.Perf_id = savedPerformance.perf_id;
        detail.date = dateTime.date;
        detail.time = dateTime.time;
        const savedDetail = await this.performanceDetailRepository.save(detail);

        // seat_row로 Seat 데이터를 찾아 perfd_id를 저장
        const seats = await this.seatRepository.find({
          where: { seat_row: dateTime.seat_row },
        });
        await Promise.all(
          seats.map(async (seat) => {
            seat.Perfd_id = savedDetail.perfd_id; // 수정: savedDetail의 perfd_id 값을 사용
            await this.seatRepository.save(seat);
          }),
        );
        return savedDetail;
      }),
    );

    savedPerformance.details = savedDetails;
    delete savedPerformance['perf_date_time'];
    return {
      message: `공연 등록이 완료되었습니다.`,
      data: savedPerformance,
    };
  }

  //-- 공연 전체조회 --//
  async getAll() {
    try {
      const Performances = await this.performanceRepository.find();
      const PerformancesDetails = await this.performanceDetailRepository.find();

      const result = Performances.map((performance) => {
        const perf_date_time = PerformancesDetails.filter(
          (detail) => detail.Perf_id === performance.perf_id,
        );
        return { ...performance, perf_date_time };
      });

      return result;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('공연 조회에 실패했습니다');
    }
  }

  //-- 공연 검색 --//
  async getSearchResult(performanceName: string) {
    try {
      // 공연
      const performances = await this.performanceRepository.find({
        where: { perf_name: Like(`%${performanceName}%`) }, // typeORM의 Likie => 부분일치 검색
        relations: ['details'], // Performance 엔티티에 설정한 관계 이름
      });

      return performances;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('공연 검색에 실패했습니다');
    }
  }

  //-- 공연 상세보기 --//
  async getPerformanceDetail(performanceId: number) {
    // 공연 ID로 Performance 정보 조회
    const performance = await this.performanceRepository.findOne({
      where: { perf_id: performanceId },
      relations: ['details'],
    });

    if (!performance) {
      throw new Error('Performance not found.');
    }

    // 관련된 PerformanceDetail 정보 조회
    const performanceDetails = performance.details;

    // PerformanceDetail 객체에 해당하는 seats 데이터를 넣는다.
    for (const detail of performanceDetails) {
      const seats = await this.seatRepository.find({
        where: { Perfd_id: detail.Perf_id },
      });
      detail.seats = seats;
    }

    return {
      performance: performance,
      performanceDetails: performanceDetails,
    };
  }
}
