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

  @Get('vendas-por-meses')
  getVendasPorMes(@Query('meses') meses: string) {
    const quantidadeMeses = meses ? Number(meses) : 3;
    return this.relatoriosService.vendasPorMes(Number(quantidadeMeses));
  }

  @Get('pedidos')
  getPedidos(@Query('quantidade') quantidade: string) {
    const quantidadePedidos = quantidade ? Number(quantidade) : 3;
    return this.relatoriosService.ultimosPedidos(Number(quantidadePedidos));
  }
  @Get('status-pedidos')
  getStatusPedidos() {
    return this.relatoriosService.statusPedidos();
  }
}
