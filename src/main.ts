import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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
    await earthquakesService.seedEarthquakes();
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
}
bootstrap();
