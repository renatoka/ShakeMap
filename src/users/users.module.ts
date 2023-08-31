import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailerService } from '@/mailer/mailer.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, MailerService],
})
export class UsersModule {}
