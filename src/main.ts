import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { EarthquakesService } from './earthquakes/earthquakes.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const earthquakesService = app.get(EarthquakesService);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3001);
  try {
    const start = new Date(new Date().setHours(0, 0, 0, 0)).toISOString(); // 00:00:00
    const end = new Date().toISOString(); // now

    await earthquakesService.fetchEarthquakes({
      start: start,
      end: end,
      limit: null,
    });
    Logger.log(`Fetched earthquakes from ${start} to ${end}`, 'Bootstrap');
  } catch (error) {
    Logger.error(error, 'Bootstrap');
  }
}
bootstrap();
