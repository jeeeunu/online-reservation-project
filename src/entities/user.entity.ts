import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Performance } from './performance.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  user_email: string;

  @Column()
  user_password: string;

  @Column()
  user_name: string;

  @Column()
  user_point: number;

  @Column()
  user_image: string;

  @Column({ default: false })
  is_admin: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];

  @OneToMany(() => Performance, (performance) => performance.user)
  performance: Performance[];
}
