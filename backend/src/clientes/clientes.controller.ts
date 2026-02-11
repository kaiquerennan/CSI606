import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ClientesService } from './clientes.service';

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

  @Post()
  async create(
    @Body()
    body: {
      nome: string;
      email: string;
      documento: string;
      natureza?: string;
      ativo?: boolean;
      senha?: string;
    },
  ) {
    return this.clientesService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.clientesService.update(Number(id), body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.clientesService.delete(Number(id));
  }
}
