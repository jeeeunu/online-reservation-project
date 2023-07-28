import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/create-user.dto';
import { SignInDto } from '../auth/dto/sign-in-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입
  @Post()
  signUp(@Body() user: UserCreateDto) {
    return this.userService.signUp(user);
  }

  // 로그인
  @Post('/login')
  async login(@Body() signInDto: SignInDto): Promise<any> {
    return await this.userService.signIn(signInDto);
  }
}
