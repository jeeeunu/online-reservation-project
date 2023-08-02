import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

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
  created_At: Date;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'User_id' })
  user: User;
}
