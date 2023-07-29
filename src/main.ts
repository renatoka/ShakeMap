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
    await earthquakesService.fetchEarthquakes({
      start: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      end: new Date().toISOString(),
      limit: 1000,
    });
  } catch (error) {
    Logger.error(error, 'Bootstrap');
  }
}
bootstrap();
