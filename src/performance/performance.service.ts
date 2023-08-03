// performance.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Performance } from '../entities/performance.entity';
import { Seat } from '../entities/seat.entity';
import { PerformanceDetail } from '../entities/performanceDetail.entity';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { performanceInterface } from './interfaces/performance.interface';

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
  ): Promise<{ message: string; data: performanceInterface } | undefined> {
    try {
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
          const savedDetail = await this.performanceDetailRepository.save(
            detail,
          );

          // seat_row로 Seat 데이터를 찾아 perfd_id를 저장
          const seats = await this.seatRepository.find({
            where: { seat_row: dateTime.seat_row },
          });
          await Promise.all(
            seats.map(async (seat) => {
              seat.Perfd_id = savedDetail.perfd_id;
              await this.seatRepository.save(seat);
            }),
          );
          return savedDetail;
        }),
      );

      savedPerformance.details = savedDetails;
      delete savedPerformance['perf_date_time'];
      return {
        message: '공연 등록이 완료되었습니다.',
        data: savedPerformance,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //-- 공연 전체조회 --//
  async getAll(): Promise<performanceInterface[]> {
    try {
      const Performances = await this.performanceRepository.find({
        relations: ['details'],
        select: {
          perf_id: true,
          perf_name: true,
          perf_description: true,
          perf_category: true,
          perf_price: true,
          perf_address: true,
          perf_image: true,
          created_At: true,
          updated_At: true,
        },
      });

      return Performances;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //-- 공연 검색 --//
  async getSearchResult(
    performanceName: string,
  ): Promise<performanceInterface[]> {
    try {
      // 공연
      const performances = await this.performanceRepository.find({
        where: { perf_name: Like(`%${performanceName}%`) }, // typeORM의 Like => 부분일치 검색
        relations: ['details'], // Performance 엔티티에 설정한 관계 이름
        select: {
          perf_id: true,
          perf_name: true,
          perf_description: true,
          perf_category: true,
          perf_price: true,
          perf_address: true,
          perf_image: true,
          created_At: true,
          updated_At: true,
        },
      });

      if (performances.length === 0) {
        throw new HttpException(
          '해당하는 공연이 없습니다.',
          HttpStatus.NOT_FOUND,
        );
      }

      return performances;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //-- 공연 상세보기 --//
  async getPerformanceDetail(
    performanceId: number,
  ): Promise<performanceInterface> {
    try {
      const performance = await this.performanceRepository.findOne({
        where: { perf_id: performanceId },
        relations: ['details', 'details.seats'],
      });

      if (!performance) {
        throw new HttpException(
          '해당하는 공연이 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return performance;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
