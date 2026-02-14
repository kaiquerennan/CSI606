import { Controller, Query, Get, Post, Put, Param, Body } from '@nestjs/common';
import { VendasService } from './vendas.service';

@Controller('vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Get()
  async findAll(
    @Query('status') status: string,
    @Query('page') page: string,
    @Query('perPage') perPage: string,
  ) {
    const pageNum = page ? Number(page) : 1;
    const perPageNum = perPage ? Number(perPage) : 20;
    return this.vendasService.findAll(pageNum, perPageNum, status);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.vendasService.findById(Number(id));
  }

  @Post()
  async create(
    @Body()
    body: {
      clienteId: number;
      itens: { produtoId: number; quantidade: number }[];
    },
  ) {
    return this.vendasService.create(body);
  }

  @Put(':id/cancelar')
  async cancelar(@Param('id') id: string) {
    return this.vendasService.cancelar(Number(id));
  }
}
