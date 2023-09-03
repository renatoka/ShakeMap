import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MapboxTokenService {
  constructor(private configService: ConfigService) {}
  getToken(): string {
    const token = this.configService.get('MAPBOX_TOKEN');
    if (!token) {
      throw new Error('Mapbox token not configured');
    }
    return token;
  }
}
