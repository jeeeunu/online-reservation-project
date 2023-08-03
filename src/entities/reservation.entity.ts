import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Performance } from './performance.entity';
import { PerformanceDetail } from './performanceDetail.entity';

@Entity({ name: 'Reservation' })
export class Reservation {
  @PrimaryGeneratedColumn()
  res_id: number;

  @Column()
  User_id: number;

  @Column()
  Perf_id: number;

  @Column()
  Perfd_id: number;

  @Column()
  Seat_id: number;

  @Column()
  price: number;

  @Column({ type: 'timestamp' })
  created_At: string;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'User_id' })
  user: User;

  @ManyToOne(() => Performance, (performance) => performance.reservations)
  @JoinColumn({ name: 'Perf_id' })
  performance: Performance;

  @OneToOne(() => PerformanceDetail, (detail) => detail.reservation)
  @JoinColumn({ name: 'Perfd_id' })
  detail: PerformanceDetail;
}
