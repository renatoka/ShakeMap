import { Controller, Get } from '@nestjs/common';
import { MapboxTokenService } from './mapbox-token.service';

@Controller('api/token')
export class MapboxTokenController {
  constructor(private tokenService: MapboxTokenService) {}
  @Get()
  getToken(): string {
    return this.tokenService.getToken();
  }
}
