import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPromise } from 'src/interfaces';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Query('id') id: string): Promise<UserPromise> {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/unsubscribe/:id')
  unsubscribeUser(@Query('id') id: string): Promise<boolean> {
    return this.usersService.unsubscribeUser(id);
  }
}
