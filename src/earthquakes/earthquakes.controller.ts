import { EarthquakePromise } from '@/interfaces';
import { Controller, Get, Res, Query } from '@nestjs/common';
import { GetEarthquakesDTO } from './dto/get-earthquakes.dto';
import { EarthquakesService } from './earthquakes.service';

@Controller('api/earthquakes')
export class EarthquakesController {
  constructor(private earthquakeService: EarthquakesService) {}

  @Get()
  async getAllEarthquakes(
    @Res() res,
    @Query() query: GetEarthquakesDTO,
  ): EarthquakePromise {
    const response = await this.earthquakeService.getAllEarthquakes(query);
    res.set('X-Total-Count', response.count);
    return res.json(response.earthquakes);
  }

  @Get('/by-date')
  async fetchAndGetEarthquakesByDate(
    @Res() res,
    @Query() query: GetEarthquakesDTO,
  ): EarthquakePromise {
    const response =
      await this.earthquakeService.fetchAndGetEarthquakesByDate(query);
    res.set('X-Total-Count', response.count);
    return res.json(response.earthquakes);
  }
}
