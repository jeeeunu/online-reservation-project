import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Performance } from '../entities/performance.entity';
import { Reservation } from '../entities/reservation.entity';
import { User } from '../entities/user.entity';
import { Seat } from '../entities/seat.entity';
import { reservationInterface } from './interfaces/reservation.interface';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Performance)
    private performanceRepository: Repository<Performance>,

    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,

    // 트랜잭션 적용
    private dataSource: DataSource,
  ) {}

  //-- 공연 예매 --//
  async create(
    parsedPerfId: number,
    reservation: CreateReservationDto,
  ): Promise<{ message: string; data: reservationInterface }> {
    // 트랜잭션
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 공연
      const performance = await this.performanceRepository.findOne({
        where: { perf_id: parsedPerfId },
        relations: ['user'],
      });

      if (!performance) {
        throw new HttpException(
          '해당하는 공연이 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 좌석
      const seat = await queryRunner.manager.findOne(Seat, {
        where: { seat_id: reservation.Seat_id },
        lock: { mode: 'pessimistic_write' }, // 동시성 처리를 위해 이미 예매중인 seat에 접근하지 못하도록 설정
      });

      if (!seat) {
        throw new HttpException(
          '좌석 정보가 잘못되었습니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (seat.seat_reservation === true) {
        throw new HttpException(
          '이미 예약된 좌석입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      seat.seat_reservation = true;

      // 어드민 유저
      const userAdmin = await this.userRepository.findOne({
        where: { user_id: performance.user.user_id },
      });
      if (!userAdmin) {
        throw new HttpException(
          '관리자 정보가 잘못되었습니다',
          HttpStatus.NOT_FOUND,
        );
      }

      // 구매 유저
      const user = await this.userRepository.findOne({
        where: { user_id: reservation.User_id },
      });
      if (!user) {
        throw new HttpException(
          '유저 정보가 잘못되었습니다',
          HttpStatus.NOT_FOUND,
        );
      }
      userAdmin.user_point += reservation.price;

      if (user.user_point < reservation.price) {
        throw new HttpException(
          '포인트가 부족하여 예매를 실패했습니다.',
          HttpStatus.FORBIDDEN,
        );
      }

      user.user_point -= reservation.price;

      // 데이터 반영
      await this.userRepository.save(userAdmin);
      await this.userRepository.save(user);
      await queryRunner.manager.save(seat);
      const reservatedData = await this.reservationRepository.save({
        ...reservation,
        Perf_id: parsedPerfId,
      });
      await queryRunner.commitTransaction();

      const reservationInfo: reservationInterface =
        await this.reservationRepository.findOne({
          where: { res_id: reservatedData.res_id },
          relations: ['performance', 'detail'],
          select: {
            res_id: true,
            Seat_id: true,
            price: true,
            created_At: true,
            performance: {
              perf_id: true,
              User_id: true,
              perf_name: true,
              perf_description: true,
              perf_address: true,
            },
            detail: {
              date: true,
              time: true,
            },
          },
        });

      return {
        message: '공연 예매가 완료되었습니다',
        data: reservationInfo,
      };
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release(); // 객체 해제 (메모리 반환)
      throw error;
    }
  }

  //-- 예매 현황 --//
  async getAll(user_id: number): Promise<reservationInterface[]> {
    try {
      const reservationData = await this.reservationRepository.find({
        where: { User_id: user_id },
        relations: ['performance', 'detail'],
        select: {
          res_id: true,
          Seat_id: true,
          price: true,
          created_At: true,
          performance: {
            perf_id: true,
            User_id: true,
            perf_name: true,
            perf_description: true,
            perf_address: true,
          },
          detail: {
            date: true,
            time: true,
          },
        },
      });

      if (reservationData.length === 0) {
        throw new HttpException('예매 내역이 없습니다.', HttpStatus.NOT_FOUND);
      }
      return reservationData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
