// user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  // Delete,
} from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/create-user.dto';
import { UserProfile } from './dto/user-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입
  @Post()
  signUp(@Body() user: UserCreateDto) {
    if (!user.user_email || !user.user_password || !user.user_password) {
      throw new HttpException(
        '필수 항목 데이터를 확인해주세요.',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.userService.signUp(user);
  }

  // 프로필 보기
  @Get(':id')
  getProfile(@Param('id') userId: number): Promise<UserProfile> {
    return this.userService.getUserById(userId);
  }
}
