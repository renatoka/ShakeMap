import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EarthquakesService } from 'src/earthquakes/earthquakes.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private readonly earthquakesService: EarthquakesService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkForEarthquakes() {
    try {
      const startTime = new Date().getTime();
      const start = new Date(new Date().setHours(0, 0, 0, 0));
      const end = new Date(new Date().setMinutes(new Date().getMinutes() - 5));
      await this.earthquakesService.fetchEarthquakes({
        start: start.toISOString(),
        end: end.toISOString(),
        limit: null,
      });
      const endTime = new Date().getTime();
      this.logger.log(
        `CRON: Fetched and save earthquakes. Time took: ${
          endTime - startTime
        } ms`,
      );
    } catch (error) {
      Logger.error(error, 'CRON');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteOldEarthquakes() {
    try {
      const startTime = new Date().getTime();
      const deleteProcess = await this.earthquakesService.delete();
      const endTime = new Date().getTime();
      this.logger.log(
        `CRON: Deleted old earthquakes. Time took: ${
          endTime - startTime
        } ms. Deteted: ${deleteProcess.count} earthquakes`,
      );
    } catch (error) {
      Logger.error(error, 'CRON');
    }
  }
}
