import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MapboxTokenService {
  constructor(private configService: ConfigService) {}
  getToken(): string {
    return this.configService.get('MAPBOX_TOKEN');
  }
}
