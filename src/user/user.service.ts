import { Injectable, ConflictException } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDto } from './dto/create-user.dto';
import { UserProfile } from './dto/user-profile.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 회원가입
  async signUp(user: UserCreateDto): Promise<UserCreateDto | undefined> {
    const existingUser = await this.userRepository.findOne({
      where: { user_email: user.user_email },
    });

    if (existingUser) {
      throw new ConflictException('이미 존재하는 사용자입니다.');
    }

    user.user_password = await bcrypt.hash(user.user_password, 10);
    return await this.userRepository.save(user);
  }

  // 프로필 보기
  async getUserById(userId: number): Promise<UserProfile> {
    // Data : user
    const user: UserProfile = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    // Validation : user_id 일치하는 데이터 확인
    if (!user) {
      throw new HttpException(
        'user_id와 일치하는 유저가 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    // userProfile : 반환할 데이터
    const userProfile: UserProfile = {
      user_id: user.user_id,
      user_email: user.user_email,
      user_name: user.user_name,
      user_point: user.user_point,
      user_image: user.user_image,
    };
    return userProfile;
  }
}
