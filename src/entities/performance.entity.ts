// performance.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PerformanceDetail } from './performanceDetail.entity';
import { User } from './user.entity';
import { Reservation } from './reservation.entity';

@Entity({ name: 'Performance' })
export class Performance {
  @PrimaryGeneratedColumn()
  perf_id: number;

  @Column()
  User_id: number;

  @Column()
  perf_name: string;

  @Column()
  perf_description: string;

  @Column()
  perf_category: string;

  @Column()
  perf_price: number;

  @Column()
  perf_address: string;

  @Column()
  perf_image: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_At: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_At: Date;

  @OneToMany(() => PerformanceDetail, (detail) => detail.performance)
  details: PerformanceDetail[];

  @ManyToOne(() => User, (user) => user.performance)
  @JoinColumn({ name: 'User_id' })
  user: User;

  @OneToMany(() => Reservation, (reservation) => reservation.performance)
  reservations: Reservation[];
}
