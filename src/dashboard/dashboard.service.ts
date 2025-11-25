import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  async getVendasmes(mes: number) {
    // Debug: get distinct months
    const monthsResult = await this.prisma.$queryRaw<{ month: number }[]>`
      SELECT DISTINCT EXTRACT(MONTH FROM data) as month FROM "Vendas" ORDER BY month
    `;
    const months = monthsResult.map(r => Number(r.month));

    const result = await this.prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM "Vendas"
      WHERE EXTRACT(MONTH FROM data) = ${mes}
    `;
    const countMes = Number(result[0].count);

    const totalResult = await this.prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "Vendas"
    `;
    const total = Number(totalResult[0].count);

    return { countMes, total, months };
  }
}
