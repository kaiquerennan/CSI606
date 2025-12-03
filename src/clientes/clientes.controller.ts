import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common'
import { ClientesService } from './clientes.service'

@Controller('clientes')

export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  // GET /users
  @Get()
  async findAll() {
    return this.clientesService.findAll();
  }

  // GET /users/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clientesService.findById(Number(id));
  }

  // POST /users
  @Post()
  async create(@Body('nome') nome: string, @Body('email') email: string) {
    return this.clientesService.create(nome, email);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.clientesService.delete(Number(id));
  }
}
