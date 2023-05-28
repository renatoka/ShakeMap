import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { UserPromise } from 'src/interfaces';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
    private config: ConfigService,
  ) {}

  async findOne(id: string): Promise<UserPromise> {
    const user = await this.prisma.users.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      const receivers = { email: createUserDto.email };
      const user = await this.prisma.users.create({
        data: {
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          activeSubscription: true,
        },
      });
      const mailData = {
        sender: { email: this.config.get<string>('EMAIL_SENDER') },
        receivers: [receivers],
        subject: 'Thank you for signing up!',
        params: {
          firstName: user.firstName,
        },
      };
      await this.mailer.sendMail(mailData, 'signup');
      return true;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User already exists.');
      }
      return error;
    }
  }

  async unsubscribeUser(id: string): Promise<boolean> {
    const user = await this.prisma.users.update({
      where: {
        id: parseInt(id),
      },
      data: {
        activeSubscription: false,
      },
    });
    return user.activeSubscription === false ? true : false;
  }

  async findSubscribedUsers(): Promise<UserPromise[]> {
    const subscribers = await this.prisma.users.findMany({
      where: {
        activeSubscription: true,
      },
    });
    return subscribers;
  }
}
