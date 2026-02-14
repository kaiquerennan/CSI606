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

  // ============= NOVOS ENDPOINTS =============

  @Get('resumo')
  getResumo() {
    return this.relatoriosService.resumoRelatorios();
  }

  @Get('top-produtos')
  getTopProdutos(@Query('limite') limite: string) {
    return this.relatoriosService.topProdutos(limite ? Number(limite) : 10);
  }

  @Get('top-clientes')
  getTopClientes(@Query('limite') limite: string) {
    return this.relatoriosService.topClientes(limite ? Number(limite) : 10);
  }

  @Get('receita-por-categoria')
  getReceitaPorCategoria() {
    return this.relatoriosService.receitaPorCategoria();
  }

  @Get('estoque-baixo')
  getEstoqueBaixo(@Query('limite') limite: string) {
    return this.relatoriosService.produtosEstoqueBaixo(
      limite ? Number(limite) : 10,
    );
  }

  @Get('vendas-por-dia')
  getVendasPorDia(@Query('dias') dias: string) {
    return this.relatoriosService.vendasPorDia(dias ? Number(dias) : 30);
  }

  @Get('vendas-por-dia-semana')
  getVendasPorDiaSemana() {
    return this.relatoriosService.vendasPorDiaSemana();
  }

  @Get('clientes-por-mes')
  getClientesPorMes(@Query('meses') meses: string) {
    return this.relatoriosService.clientesNovosPorMes(
      meses ? Number(meses) : 6,
    );
  }
}
