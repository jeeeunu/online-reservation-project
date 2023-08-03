import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, DataSource, Any } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Performance } from '../entities/performance.entity';
import { Reservation } from '../entities/reservation.entity';
import { User } from '../entities/user.entity';
import { Seat } from '../entities/seat.entity';

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
    reservation: CreateReservationDto,
  ): Promise<{ message: string; data: object }> {
    // 트랜잭션
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 공연
      const performance = await this.performanceRepository.findOne({
        where: { perf_id: reservation.Perf_id },
        relations: ['user'],
      });
      if (!performance) {
        throw new HttpException(
          '해당하는 공연이 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 좌석
      const seat = await this.seatRepository.findOne({
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
      await this.seatRepository.save(seat);
      await this.reservationRepository.save(reservation);

      // 반환할 예매 현황
      const reservationInfo = await this.performanceRepository
        .createQueryBuilder('performance') // 'performance'라는 별칭으로 Performance 엔티티를 기준으로 쿼리 작성
        .leftJoinAndSelect('performance.details', 'details') // Performance과 details 엔티티를 LEFT JOIN하고, 'details'라는 별칭으로 사용
        .where('details.Perfd_id = :perfd_id', {
          perfd_id: reservation.Perfd_id,
        }) // details의 Perfd_id가 지정한 값과 일치하는 조건을 추가
        .getOne(); // 결과를 하나의 엔티티로 가져옴

      return {
        message: '공연 예매가 완료되었습니다',
        data: reservationInfo,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw error;
    } finally {
      await queryRunner.release(); // 객체 해제 (메모리 반환)
    }
  }

  //-- 예매 현황 --//
  async getAll(user_id: number) {
    try {
      const reservationData = await this.reservationRepository.find({
        where: { User_id: user_id },
        relations: ['performance'],
        select: {
          performance: {
            perf_name: true,
            perf_price: true,
            perf_address: true,
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
