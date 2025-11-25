import { Controller, Get, Post, Delete, Put, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('vendas-mes/:mes')
  getVendasMes(@Param('mes') mes: string) {
    return this.dashboardService.getVendasmes(Number(mes));
  }
}
