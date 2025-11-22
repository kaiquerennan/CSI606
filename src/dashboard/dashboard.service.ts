import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const totalVendas = await this.prisma.vendas.count();

    const valorTotal = await this.prisma.vendas.aggregate({
      _sum: { valor: true },
    });

    const ticketMedio =
      totalVendas > 0 ? valorTotal._sum.valor / totalVendas : 0;

    const clientesAtivos = await this.prisma.usuario.count();

    return {
      totalVendas,
      valorTotal: valorTotal._sum.valor.toFixed(2),
      ticketMedio: ticketMedio.toFixed(2),
      clientesAtivos,
    };
  }
}
