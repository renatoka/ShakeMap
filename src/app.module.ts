import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EarthquakesModule } from './earthquakes/earthquakes.module';
import { MapboxTokenModule } from './mapbox-token/mapbox-token.module';
import { UsersModule } from './users/users.module';
import { MailerService } from './mailer/mailer.service';
import { JwtModule } from '@nestjs/jwt';

const configService = new ConfigService();

@Module({
  imports: [
    EarthquakesModule,
    MapboxTokenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: configService.get<string>('JWT_SECRET'),
    }),
    ScheduleModule.forRoot(),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
