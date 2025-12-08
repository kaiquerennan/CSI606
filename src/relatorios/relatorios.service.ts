import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  async vendasPorCategoria(dias?: number) {
    let dataInicio: Date | undefined = undefined;
    let vendasPorCategoria: any[];

    if (dias) {
      dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() - dias);

      vendasPorCategoria = await this.prisma.$queryRaw<any[]>`
        SELECT p.CATEGORIA as categoria, 
               SUM(iv.quantidade)::text as quantidade_vendidas
        FROM "itens_vendas" iv INNER JOIN "Produto" p
        ON iv."produtoId" = p.id 
        WHERE iv.data >=${dataInicio}
        GROUP BY p.CATEGORIA LIMIT 5
      `;
    } else {
      vendasPorCategoria = await this.prisma.$queryRaw<any[]>`
    SELECT p.CATEGORIA as categoria,
           SUM(iv.quantidade)::text as quantidade_vendidas
    FROM "itens_vendas" iv
    INNER JOIN "Produto" p ON iv."produtoId" = p.id
    GROUP BY p.CATEGORIA
    LIMIT 5
    `;
    }
    return vendasPorCategoria;
  }

  async frequencia(dias?) {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - dias);

    return await this.prisma.vendas.groupBy({
      by: ['usuarioId'],
      where: {
        data: {
          gte: dataLimite,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });
  }

  async vendasPorMes(quantidadeMeses: number = 3) {
    const hoje = new Date();
    const dataInicial = new Date(
      hoje.getFullYear(),
      hoje.getMonth() - (quantidadeMeses - 1),
      1,
    );
    const vendas = await this.prisma.vendas.findMany({
      where: {
        data: {
          gte: dataInicial,
        },
      },
      select: {
        valor: true,
        data: true,
      },
      orderBy: {
        data: 'asc',
      },
    });

    const grupos: Record<string, { receita: number; transacoes: number }> = {};

    for (const venda of vendas) {
      const key = venda.data.toISOString().slice(0, 7); // "2025-11"

      if (!grupos[key]) {
        grupos[key] = { receita: 0, transacoes: 0 };
      }

      grupos[key].receita += venda.valor;
      grupos[key].transacoes += 1;
    }

    const meses = Object.entries(grupos).map(([mes, dados]) => {
      const ticketMedio =
        dados.transacoes > 0 ? dados.receita / dados.transacoes : 0;

      return {
        mes,
        receita: parseFloat(dados.receita.toFixed(2)),
        transacoes: dados.transacoes,
        ticketMedio: parseFloat(ticketMedio.toFixed(2)),
        crescimento: 0,
      };
    });

    for (let i = 1; i < meses.length; i++) {
      const atual = meses[i];
      const anterior = meses[i - 1];

      const crescimentoCalc =
        anterior.receita === 0
          ? 0
          : ((atual.receita - anterior.receita) / anterior.receita) * 100;

      atual.crescimento = parseFloat(crescimentoCalc.toFixed(2));
    }

    meses[0].crescimento = 0;

    return meses;
  }
}
