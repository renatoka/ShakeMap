import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';
export class GetEarthquakesDTO {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  start: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  end: string;
}
