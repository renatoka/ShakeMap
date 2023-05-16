import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EarthquakesModule } from './earthquakes/earthquakes.module';
import { MapboxTokenModule } from './mapbox-token/mapbox-token.module';
@Module({
  imports: [
    EarthquakesModule,
    MapboxTokenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
