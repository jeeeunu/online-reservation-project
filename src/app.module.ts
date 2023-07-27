// app.module.ts
import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ormConfig } from './orm.config';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    UserModule,
    // 환경변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
  ],
})
export class AppModule {}
