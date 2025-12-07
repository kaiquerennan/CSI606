import { Controller, Get, Param, Query } from '@nestjs/common';
import { RelatoriosService } from './relatorios.service';

@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('vendas-por-categoria/:dias')
  getVendasPorCategoria(@Param('dias') dias: string) {
    return this.relatoriosService.vendasPorCategoria(
      dias ? Number(dias) : undefined,
    );
  }

  @Get('frequencia-de-compras')
  getFrequencia(@Query('dias') dias = '30') {
    return this.relatoriosService.frequencia(Number(dias));
  }
}
