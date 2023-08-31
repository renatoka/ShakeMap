import { EarthquakePromise } from '@/interfaces';
import { PrismaService } from '@/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { CreateEarthquakesDto } from './dto/create-earthquakes.dto';
import { GetEarthquakesDTO } from './dto/get-earthquakes.dto';

@Injectable()
export class EarthquakesService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  async create(createEarthquakeDTO: CreateEarthquakesDto) {
    const { earthquakes } = createEarthquakeDTO;
    try {
      const savePromises = earthquakes.map(async (earthquake) => {
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
      });

      await Promise.all(savePromises);

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
      return count;
    } catch (error) {
      return error;
    }
  }

  async fetchEarthquakes(
    getEarthquakesDTO: GetEarthquakesDTO,
  ): EarthquakePromise {
    const { start, end } = getEarthquakesDTO;
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

      return {
        earthquakes: response.data.features,
        count: response.data.features.length,
      };
    } catch (error) {
      return error;
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
      return error;
    }
  }

  async fetchAndGetEarthquakesByDate(
    getEarthquakesDTO: GetEarthquakesDTO,
  ): Promise<EarthquakePromise> {
    const { start, end, limit } = getEarthquakesDTO;
    try {
      await this.fetchEarthquakes(getEarthquakesDTO);
      const where = Prisma.validator<Prisma.EarthquakesWhereInput>()({
        time: { gte: start, lte: end },
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

  async findForNewsletter() {
    const start = new Date(new Date().setDate(new Date().getDate() - 1));
    const end = new Date(new Date().setDate(new Date().getDate() - 1));
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    try {
      const where = Prisma.validator<Prisma.EarthquakesWhereInput>()({
        time: { gte: start, lte: end },
      });
      const count = await this.prisma.earthquakes.count({
        where,
      });
      const earthquakes = await this.prisma.earthquakes.findMany({
        where,
        orderBy: {
          mag: 'desc',
        },
      });

      const region = await findMostActiveRegion(earthquakes, count);
      const strongest = earthquakes[0];

      return { region, count, strongest };
    } catch (error) {
      return error;
    }
  }
}

async function findMostActiveRegion(
  earthquakes: any[],
  count: number,
): Promise<{ region: string; count: number; mean: number }> {
  const regions = earthquakes.map((earthquake) => earthquake.flynn_region);
  const total = earthquakes.reduce((acc, earthquake) => {
    return acc + earthquake.mag;
  }, 0);
  const mean = total / count;
  const uniqueRegions = [...new Set(regions)];
  const counts = uniqueRegions.map((region) => {
    return {
      region,
      count: regions.filter((r) => r === region).length,
    };
  });
  const sortedCounts = counts.sort((a, b) => b.count - a.count);
  return { region: sortedCounts[0].region, count: sortedCounts[0].count, mean };
}
