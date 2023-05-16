// validate nested

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEarthquakesDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InnerProperties)
  earthquakes: InnerProperties[];
}

export class InnerProperties {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Properties)
  properties: Properties[];
}

export class Properties {
  @IsString()
  @IsNotEmpty()
  auth: string;

  @IsNumber()
  @IsNotEmpty()
  depth: number;

  @IsString()
  @IsNotEmpty()
  evtype: string;

  @IsString()
  @IsNotEmpty()
  flynn_region: string;

  @IsString()
  @IsNotEmpty()
  lastupdate: string;

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lon: number;

  @IsNumber()
  @IsNotEmpty()
  mag: number;

  @IsString()
  @IsNotEmpty()
  magtype: string;

  @IsString()
  @IsNotEmpty()
  source_catalog: string;

  @IsString()
  @IsNotEmpty()
  source_id: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  unid: string;
}
