// performance.module.ts
import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';
import { Performance } from '../entities/performance.entity';
import { PerformanceDetail } from '../entities/performanceDetail.entity';
import { User } from '../entities/user.entity';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { Seat } from 'src/entities/seat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Performance, PerformanceDetail, Seat, User]),
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService],
})
export class PerformanceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'Performance', method: RequestMethod.POST });
  }
}
