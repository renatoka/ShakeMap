import { Module } from '@nestjs/common';
import { MapboxTokenController } from './mapbox-token.controller';
import { MapboxTokenService } from './mapbox-token.service';

@Module({
  providers: [MapboxTokenService],
  controllers: [MapboxTokenController],
})
export class MapboxTokenModule {}
