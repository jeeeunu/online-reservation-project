import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // transform: true옵션을 넣으면 데이터 타입 변환을 해줌 (URI에 들어가는 파라미터는 항상 string이기에 사용함)
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
