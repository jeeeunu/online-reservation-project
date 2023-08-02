import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Performance } from 'src/entities/performance.entity';
import { Reservation } from 'src/entities/reservation.entity';
import { User } from 'src/entities/user.entity';
import { Seat } from 'src/entities/seat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from '../middlewares/auth.middleware';
@Module({
  imports: [TypeOrmModule.forFeature([Performance, Reservation, User, Seat])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'reservation/:Perf_id', method: RequestMethod.POST });
  }
}
