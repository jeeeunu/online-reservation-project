import { Injectable } from '@nestjs/common';
import { UserCreateDto } from './dto/create-user.dto';
import { SignInDto } from '../auth/dto/sign-in-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { promises } from 'dns';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 회원가입
  async signUp(user: UserCreateDto): Promise<UserCreateDto | undefined> {
    user.user_password = await bcrypt.hash(user.user_password, 10);
    return await this.userRepository.save(user);
  }

  // 로그인
  async signIn(signInDto: SignInDto): Promise<SignInDto | undefined> {
    const userFind: SignInDto = await this.userRepository.findOne({
      where: { user_email: signInDto.user_email },
    });

    // 암호화된 비밀번호와 비교
    const isPasswordMatching: boolean = await bcrypt.compare(
      signInDto.user_password,
      userFind.user_password,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        '비밀번호가 일치하지 않습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    return userFind;
  }

  // async findOne(id: number) {
  //   return await this.userRepository.findOne({ where: { id } });
  // }

  // async update(id: number, updateCatDto: UpdateUserDto) {
  //   const cat = await this.findOne(id);
  //   if (!cat) {
  //     throw new Error('cat not found');
  //   }
  //   Object.assign(cat, updateCatDto);
  //   return await this.userRepository.save(cat);
  // }

  // async remove(id: number) {
  //   const cat = await this.findOne(id);
  //   if (!cat) {
  //     throw new Error('cat not found');
  //   }
  //   return await this.userRepository.remove(cat);
  // }
}
