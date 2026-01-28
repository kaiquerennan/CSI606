import { Controller, Query, Get } from '@nestjs/common';
import { VendasService } from './vendas.service';

@Controller('vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Get()
  async findAll(@Query('status') status: string,
                @Query('page') page: number,
                @Query('perPage') perPage: number = 20) {
    return this.vendasService.findAll(page, perPage, status);
  }
}
