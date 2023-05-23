import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EarthquakesModule } from './earthquakes/earthquakes.module';
import { MapboxTokenModule } from './mapbox-token/mapbox-token.module';
import { UsersModule } from './users/users.module';
import { MailerService } from './mailer/mailer.service';
@Module({
  imports: [
    EarthquakesModule,
    MapboxTokenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
