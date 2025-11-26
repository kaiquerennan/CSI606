import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ClientesService } from './clientes.service';

@Controller('users')
export class ClientesController {
  constructor(private readonly usersService: ClientesService) {}

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
