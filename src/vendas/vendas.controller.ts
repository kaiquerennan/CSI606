import { Controller, Query, Get } from '@nestjs/common';
import { VendasService } from './vendas.service';

@Controller('vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Get()
  async findAll(@Query('status') status: string) {
    return this.vendasService.findAll(status);
  }
}
