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

    const clientesAtivos = await this.prisma.usuario.count({
      where: { ativo: true },
    });

    return {
      totalVendas,
      valorTotal: valorTotal._sum.valor.toFixed(2),
      ticketMedio: ticketMedio.toFixed(2),
      clientesAtivos,
    };
  }

  async getVendasmes(mes: number) {
    const countmes = await this.prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM "Vendas"
      WHERE EXTRACT(MONTH FROM data) = ${mes}
    `;

    const totalmes = await this.prisma.$queryRaw<{ total: number }[]>`
    SELECT  COALESCE(SUM(VALOR),0) as total FROM "Vendas"
    WHERE EXTRACT(MONTH FROM data) = ${mes}
    `;

    const totalMes = Number(totalmes[0].total);
    const qtdMes = Number(countmes[0].count);

    const ticketMedioMes =
      totalMes > 0 ? Number(totalMes / qtdMes).toFixed(2) : 0;

    return {
      countmes: Number(countmes[0].count),
      totalmes: totalmes[0].total.toFixed(2),
      ticketMedioMes,
    };
  }
}
