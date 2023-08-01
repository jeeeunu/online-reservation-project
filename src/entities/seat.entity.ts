import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { PerformanceDetail } from './performanceDetail.entity';

@Entity({ name: 'Seat' })
export class Seat {
  @PrimaryGeneratedColumn()
  seat_id: number;

  @Column()
  Perfd_id: number;

  @Column()
  seat_row: string;

  @Column()
  seat_num: string;

  @Column({ default: 0 }) // 기본값 : 0
  seat_reservation: boolean;

  @ManyToOne(() => PerformanceDetail, (detail) => detail.seats)
  @JoinColumn({ name: 'Perfd_id' })
  performanceDetail: PerformanceDetail;
}
