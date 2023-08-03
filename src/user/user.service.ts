import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './dto/create-user.dto';
import { UserProfile } from './interfaces/user-profile.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //-- 회원가입 --//
  async signUp(user: UserCreateDto): Promise<{ message: string }> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { user_email: user.user_email },
      });

      if (existingUser) {
        throw new HttpException(
          '이미 존재하는 이메일입니다.',
          HttpStatus.FORBIDDEN,
        );
      }

      user.user_password = await bcrypt.hash(user.user_password, 10);
      await this.userRepository.save(user);

      return { message: '회원가입이 완료되었습니다' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //-- 프로필 보기 --//
  async getUserById(userId: number): Promise<UserProfile> {
    try {
      const user: UserProfile = await this.userRepository.findOne({
        where: { user_id: userId },
        select: {
          user_name: true,
          user_point: true,
          user_image: true,
        },
      });

      if (!user) {
        throw new HttpException(
          'user_id와 일치하는 유저가 없습니다.',
          HttpStatus.FORBIDDEN,
        );
      }

      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
