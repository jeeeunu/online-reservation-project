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
import { UserService } from './user.service';
import { UserCreateDto } from './dto/create-user.dto';
import { UserProfile } from './dto/user-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입
  @Post()
  signUp(@Body() user: UserCreateDto) {
    return this.userService.signUp(user);
  }

  // 프로필 보기
  @Get(':id')
  getProfile(@Param('id') userId: number): Promise<UserProfile> {
    return this.userService.getUserById(userId);
  }
}
