// auth.middleware.ts
// auth.middleware.ts
import {
  Injectable,
  NestMiddleware,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authToken = req.cookies['Authentication'];

    if (authToken) {
      try {
        const payload = this.jwtService.verify(authToken);
        // console.log(payload);
        req.user = payload;
      } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
          throw new HttpException(
            '토큰이 만료되었습니다. 다시 로그인해주세요.',
            HttpStatus.FORBIDDEN,
          );
        }
        console.error(err);
        throw err;
      }
    }

    next();
  }
}
