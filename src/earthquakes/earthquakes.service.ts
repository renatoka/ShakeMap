import { EarthquakePromise } from '@/interfaces';
import { PrismaService } from '@/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { CreateEarthquakesDto } from './dto/create-earthquakes.dto';
import { GetEarthquakesDTO } from './dto/get-earthquakes.dto';

@Injectable()
export class EarthquakesService {
  private readonly logger = new Logger(EarthquakesService.name);

  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  async hasEarthquakeData(): Promise<boolean> {
    const count = await this.prisma.earthquakes.count();
    return count > 0;
  }

  async seedEarthquakes() {
    const hasData = await this.hasEarthquakeData();

    if (!hasData) {
      const startDate = new Date(new Date().setHours(0, 0, 0, 0));
      const endDate = new Date();
      const limit = 1000;

      try {
        const result = await this.fetchEarthquakes({
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          limit,
        });
        return result;
      } catch (error) {
        console.error('Error seeding earthquake data:', error);
        throw error;
      }
    }
    return 'Data already seeded.';
  }

  async create(dto: CreateEarthquakesDto) {
    const { earthquakes } = dto;
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
      this.logger.error(`Error in create method: ${error.message}`);
      throw new Error('Failed to create earthquakes');
    }
  }

  async delete() {
    try {
      const start = getStartOfDay(new Date(new Date().getDate() - 1));
      const end = getEndOfDay(new Date(new Date().getDate() - 1));

      const where = Prisma.validator<Prisma.EarthquakesWhereInput>()({
        time: { gte: start, lte: end },
      });

      const count = await this.prisma.earthquakes.count({
        where,
      });

      await this.prisma.earthquakes.deleteMany({
        where,
      });

      return { count };
    } catch (error) {
      this.logger.error(`Error in delete method: ${error.message}`);
      throw new Error('Failed to delete earthquakes');
    }
  }

  async fetchEarthquakes(
    getEarthquakesDTO: GetEarthquakesDTO,
  ): EarthquakePromise {
    const { start, end, limit } = getEarthquakesDTO;
    try {
      const where = Prisma.validator<Prisma.EarthquakesWhereInput>()({
        time: { gte: start, lte: end },
      });

      const count = await this.prisma.earthquakes.count({
        where,
      });

      if (count === 0) {
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

        const earthquakes = await this.prisma.earthquakes.findMany({
          where,
          take: limit,
          orderBy: {
            time: 'desc',
          },
        });

        return { earthquakes, count };
      } else {
        const response = await this.getEarthquakes(getEarthquakesDTO);
        return { earthquakes: response.earthquakes, count: response.count };
      }
    } catch (error) {
      this.logger.error(`Error in fetchEarthquakes method: ${error.message}`);
      throw new Error('Failed to fetch earthquakes');
    }
  }

  async getEarthquakes(
    getEarthquakesDTO: GetEarthquakesDTO,
  ): EarthquakePromise {
    const { limit, start, end } = getEarthquakesDTO;
    try {
      const where = Prisma.validator<Prisma.EarthquakesWhereInput>()({
        ...(start && end && { time: { gte: start, lte: end } }),
        ...(!start &&
          !end && {
            time: {
              gte: getStartOfDay(new Date()),
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
      this.logger.error(`Error in getAllEarthquakes method: ${error.message}`);
      throw new Error('Failed to fetch earthquakes');
    }
  }

  async findForNewsletter() {
    const start = getStartOfDay(new Date(new Date().getDate() - 1));
    const end = getEndOfDay(new Date(new Date().getDate() - 1));

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
      this.logger.error(`Error in findForNewsletter method: ${error.message}`);
      throw new Error('Failed to find earthquakes for newsletter');
    }
  }
}

function getStartOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getEndOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
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
