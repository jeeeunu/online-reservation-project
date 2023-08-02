import { Body, Res, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from '../auth/dto/sign-in-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //-- 로그인 --//
  @Post('/login')
  async login(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string; access_token: string }> {
    const access_token = await this.authService.signIn(signInDto);
    res.cookie('Authentication', access_token);
    return { message: '로그인 성공, 토큰이 생성되었습니다', access_token };
  }
}
