import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, MailerService],
})
export class UsersModule {}
