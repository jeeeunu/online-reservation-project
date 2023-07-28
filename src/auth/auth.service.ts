// auth.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SignInDto } from '../auth/dto/sign-in-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // 로그인
  async signIn(signInDto: SignInDto): Promise<string> {
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

    const payload = { user_email: signInDto.user_email };
    const access_token = await this.jwtService.signAsync(payload); // expiresIn은 app.modules의 JwtModule 설정에 따라 자동으로 적용됨
    return access_token;
  }
}
