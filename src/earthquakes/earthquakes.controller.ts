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
    @Query() dto: GetEarthquakesDTO,
  ): EarthquakePromise {
    const response = await this.earthquakeService.fetchEarthquakes(dto);
    res.set('X-Total-Count', response.count);
    return res.json(response.earthquakes);
  }
}
