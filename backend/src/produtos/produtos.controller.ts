import { Controller } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { Get, Post, Delete, Put, Param } from '@nestjs/common';

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
}
