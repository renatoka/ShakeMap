import { Controller, Post, Body, Get, Query, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserPromise } from 'src/interfaces';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findOne(@Query('id') id: string): Promise<UserPromise> {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  unsubscribeUser(@Query('id') id: string): Promise<boolean> {
    return this.usersService.unsubscribeUser(id);
  }
}
