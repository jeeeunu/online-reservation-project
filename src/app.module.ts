// app.module.ts
import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ormConfig } from './orm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PerformanceModule } from './performance/performance.module';
import { ReservationModule } from './reservation/reservation.module';
@Module({
  imports: [
    UserModule,
    // 환경변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // jwt 환경변수 설정
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('DB_JWT_SECRET_KEY'),
      }),
      inject: [ConfigService], // ConfigService 주입
    }),

    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),

    AuthModule,

    PerformanceModule,

    ReservationModule,
  ],
})
export class AppModule {}
