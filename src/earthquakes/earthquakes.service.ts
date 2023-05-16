import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEarthquakesDto } from './dto/create-earthquakes.dto';
import { GetEarthquakesDTO } from './dto/get-earthquakes.dto';
import { Prisma } from '@prisma/client';
import { EarthquakePromise } from 'src/interfaces';
@Injectable()
export class EarthquakesService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  async fetchEarthquakes(
    getEarthquakesDTO: GetEarthquakesDTO,
  ): EarthquakePromise {
    const { end, start } = getEarthquakesDTO;
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `https://www.seismicportal.eu/fdsnws/event/1/query?&format=json&start=${start}&end=${end}`,
        ),
      );
      response.data.features.map((feature: any) => {
        delete feature.geometry;
        delete feature.type;
        delete feature.id;
      });

      await this.create({ earthquakes: response.data.features });

      return { earthquakes: response.data.features };
    } catch (error) {
      return { error };
    }
  }

  async getAllEarthquakes(
    getEarthquakesDTO: GetEarthquakesDTO,
  ): EarthquakePromise {
    const { limit, start, end } = getEarthquakesDTO;
    try {
      const where = Prisma.validator<Prisma.EarthquakesWhereInput>()({
        ...(start && end && { time: { gte: start, lte: end } }),
        ...(!start &&
          !end && {
            time: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(),
            },
          }),
      });
      const count = await this.prisma.earthquakes.count({
        where,
      });
      const earthquakes = await this.prisma.earthquakes.findMany({
        where,
        take: limit,
        orderBy: {
          time: 'desc',
        },
      });

      return { earthquakes, count };
    } catch (error) {
      return { error };
    }
  }

  async fetchAndGetEarthquakesByDate(
    getEarthquakesDTO: GetEarthquakesDTO,
  ): EarthquakePromise {
    const { start, end, limit } = getEarthquakesDTO;
    try {
      await this.fetchEarthquakes(getEarthquakesDTO);
      const where = Prisma.validator<Prisma.EarthquakesWhereInput>()({
        ...(start && end && { time: { gte: start, lte: end } }),
        ...(!start &&
          !end && {
            time: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(),
            },
          }),
      });
      const count = await this.prisma.earthquakes.count({
        where,
      });
      const earthquakes = await this.prisma.earthquakes.findMany({
        where,
        take: limit,
        orderBy: {
          time: 'desc',
        },
      });
      return { earthquakes, count };
    } catch (error) {
      return { error };
    }
  }

  async create(createEarthquakeDTO: CreateEarthquakesDto) {
    const { earthquakes } = createEarthquakeDTO;
    try {
      for (const earthquake of earthquakes) {
        const unid = earthquake.properties['unid'];
        const earthquakeExists = await this.prisma.earthquakes.findUnique({
          where: {
            unid,
          },
        });

        if (!earthquakeExists) {
          await this.prisma.earthquakes.create({
            data: {
              auth: earthquake.properties['auth'],
              depth: earthquake.properties['depth'],
              evtype: earthquake.properties['evtype'],
              flynn_region: earthquake.properties['flynn_region'],
              lastupdate: earthquake.properties['lastupdate'],
              lat: earthquake.properties['lat'],
              lon: earthquake.properties['lon'],
              mag: earthquake.properties['mag'],
              magtype: earthquake.properties['magtype'],
              source_catalog: earthquake.properties['source_catalog'],
              source_id: earthquake.properties['source_id'],
              unid,
              time: earthquake.properties['time'],
            },
          });
        }
      }
      return earthquakes;
    } catch (error) {
      return error;
    }
  }

  async delete() {
    try {
      const count = await this.prisma.earthquakes.count({
        where: {
          time: {
            lte: new Date(new Date().setDate(new Date().getDate() - 1)),
          },
        },
      });
      await this.prisma.earthquakes.deleteMany({
        where: {
          time: {
            lte: new Date(new Date().setDate(new Date().getDate() - 1)),
          },
        },
      });
      return { success: true, count };
    } catch (error) {
      return { success: false, error };
    }
  }
}
