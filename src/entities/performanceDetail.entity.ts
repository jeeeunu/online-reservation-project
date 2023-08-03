// performanceDetail.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Performance } from './performance.entity';
import { Seat } from './seat.entity';
import { Reservation } from './reservation.entity';

@Entity({ name: 'PerformanceDetail' })
export class PerformanceDetail {
  @PrimaryGeneratedColumn()
  perfd_id: number;

  @Column()
  Perf_id: number;

  @Column()
  date: string;

  @Column()
  time: string;

  @ManyToOne(() => Performance, (performance) => performance.details)
  @JoinColumn({ name: 'Perf_id' })
  performance: Performance;

  @OneToMany(() => Seat, (seat) => seat.performanceDetail)
  seats: Seat[];

  @OneToOne(() => Reservation, (reservation) => reservation.detail)
  reservation: Reservation;
}
