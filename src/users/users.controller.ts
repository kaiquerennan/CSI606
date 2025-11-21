import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(Number(id));
  }

  // POST /users
  @Post()
  async create(@Body('nome') nome: string, @Body('email') email: string) {
    return this.usersService.create(nome, email);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(Number(id));
  }
}
