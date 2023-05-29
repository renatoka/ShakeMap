import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EarthquakesService } from 'src/earthquakes/earthquakes.service';
import { MailerService } from 'src/mailer/mailer.service';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class CronService {
  private logger = new Logger(CronService.name);
  constructor(
    private earthquakesService: EarthquakesService,
    private users: UsersService,
    private mailer: MailerService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkForEarthquakes() {
    try {
      const startTime = new Date().getTime();
      const start = new Date(new Date().setHours(0, 0, 0, 0));
      const end = new Date(new Date().setMinutes(new Date().getMinutes() - 5));
      await this.earthquakesService.fetchEarthquakes({
        start: start.toISOString(),
        end: end.toISOString(),
        limit: null,
      });
      const endTime = new Date().getTime();
      this.logger.log(
        `CRON: Fetched and save earthquakes. Time took: ${
          endTime - startTime
        } ms`,
      );
    } catch (error) {
      Logger.error(error, 'CRON');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteOldEarthquakes() {
    try {
      const startTime = new Date().getTime();
      const deleteProcess = await this.earthquakesService.delete();
      const endTime = new Date().getTime();
      this.logger.log(
        `CRON: Deleted old earthquakes. Time took: ${
          endTime - startTime
        } ms. Deteted: ${deleteProcess.count} earthquakes`,
      );
    } catch (error) {
      Logger.error(error, 'CRON');
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async sendDailyNewsletter() {
    const subscribers = await this.users.findSubscribedUsers();
    if (subscribers) {
      const { region, count, strongest } =
        await this.earthquakesService.findForNewsletter();
      subscribers.forEach(async (subscriber) => {
        const receivers = { email: subscriber.email };
        const Token = await this.getToken(subscriber.id, subscriber.email);
        const mailData = {
          sender: { email: this.config.get<string>('EMAIL_SENDER') },
          receivers: [receivers],
          subject: 'Daily Earthquake Report is here!',
          params: {
            firstName: subscriber.firstName,
            count: count,
            strongestMag: strongest.mag.toFixed(1),
            flynn_region: strongest.flynn_region,
            strongestDepth: strongest.depth.toFixed(1),
            mostActiveRegion: region.region,
            mostActiveCount: region.count,
            meanMagnitude: region.mean.toFixed(1),
            url: this.config.get<string>('BASE_URL') + `/unsubscribe/${Token}`,
          },
        };
        await this.mailer.sendMail(mailData, 'newsletter');
      });
    } else {
      console.log('No subscribers to send email to.');
    }
  }

  async getToken(id: number, email: string) {
    const payload = { id, email };
    const Token = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });

    this.jwt.verifyAsync(Token, {
      secret: this.config.get<string>('JWT_SECRET'),
    });

    return Token;
  }
}
