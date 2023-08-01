import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PerformanceDetail } from './performanceDetail.entity';

@Entity({ name: 'Performance' })
export class Performance {
  @PrimaryGeneratedColumn()
  perf_id: number;

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

  @CreateDateColumn()
  created_At: Date;

  @UpdateDateColumn()
  updated_At: Date;

  @OneToMany(() => PerformanceDetail, (detail) => detail.performance)
  details: PerformanceDetail[];
}
