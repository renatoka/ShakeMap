import { CronService } from '@/cron/cron.service';
import { MailerService } from '@/mailer/mailer.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '@/users/users.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EarthquakesController } from './earthquakes.controller';
import { EarthquakesService } from './earthquakes.service';

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
