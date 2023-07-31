// performanceDetail.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Performance } from './performance.entity';

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
}
