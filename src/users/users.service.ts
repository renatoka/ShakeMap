import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private mailer: MailerService) {}
  async create(createUserDto: CreateUserDto) {
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
        sender: { email: 'shakemap.service@gmail.com' },
        receivers: [receivers],
        subject: 'Welcome to Shakemap!',
        params: {
          firstName: createUserDto.firstName,
        },
      };
      await this.mailer.sendMail(mailData, 'hello-world');
      return true;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User already exists.');
      }
      return error;
    }
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
