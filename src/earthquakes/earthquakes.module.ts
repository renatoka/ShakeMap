import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EarthquakesController } from './earthquakes.controller';
import { EarthquakesService } from './earthquakes.service';
import { CronService } from 'src/cron/cron.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [HttpModule],
  controllers: [EarthquakesController],
  providers: [
    EarthquakesService,
    PrismaService,
    CronService,
    MailerService,
    UsersService,
  ],
})
export class EarthquakesModule {}
