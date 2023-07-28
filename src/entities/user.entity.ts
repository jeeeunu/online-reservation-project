import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  is_admin: boolean;
}
