import { Controller } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { Get, Post, Delete, Put, Param, Body } from '@nestjs/common';
import type { Produto } from '../../generated/prisma';

@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Get()
  async findAll() {
    return this.produtosService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.produtosService.findById(Number(id));
  }

  @Delete('id')
  async delete(@Param('id') id: string) {
    return this.produtosService.delete(Number(id));
  }

  @Post()
  async create(@Body() data: any) {
    // Mudado para any temporariamente ou crie um DTO
    return this.produtosService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.produtosService.update(Number(id), data);
  }
}
