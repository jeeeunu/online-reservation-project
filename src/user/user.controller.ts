// user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/create-user.dto';
import { UserProfile } from './dto/user-profile.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //-- 회원가입 --//
  @Post()
  async signUp(@Body() user: UserCreateDto) {
    // 필수항목 검사
    if (!user.user_email || !user.user_password || !user.user_password) {
      throw new HttpException(
        '필수 항목 데이터를 확인해주세요.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 비밀번호 정규식 확인
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/; // 영어+숫자 조합, 최소 6자 이상
    if (!passwordPattern.test(user.user_password)) {
      throw new HttpException(
        '비밀번호는 영어+숫자로 최소 6자 이상이여야 합니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.userService.signUp(user);
  }

  //-- 프로필 보기 --//
  @Get(':id')
  async getProfile(@Param('id') userId: number): Promise<UserProfile> {
    return await this.userService.getUserById(userId);
  }
}
