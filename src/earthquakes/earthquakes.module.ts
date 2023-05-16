import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EarthquakesController } from './earthquakes.controller';
import { EarthquakesService } from './earthquakes.service';
import { CronService } from 'src/cron/cron.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [EarthquakesController],
  providers: [EarthquakesService, PrismaService, CronService],
})
export class EarthquakesModule {}
