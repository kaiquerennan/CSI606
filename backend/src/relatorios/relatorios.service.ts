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

  async vendasPorMes(quantidadeMeses) {
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

    if (meses.length > 0) {
      meses[0].crescimento = 0;
    }

    return meses;
  }

  async ultimosPedidos(quantidadePedidos) {
    const ultimosPedidos = await this.prisma.vendas.findMany({
      take: quantidadePedidos,
      orderBy: {
        data: 'desc',
      },
    });
    return ultimosPedidos;
  }

  async statusPedidos() {
    const statusPedidos = await this.prisma.vendas.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });
    return statusPedidos;
  }

  async topProdutos(limite: number = 10) {
    const produtos = await this.prisma.$queryRaw<any[]>`
      SELECT p.id, p.descricao, p.categoria, p.preco,
             SUM(iv.quantidade)::text as total_vendido,
             SUM(iv."valorTotal")::text as receita_total
      FROM "itens_vendas" iv
      INNER JOIN "Produto" p ON iv."produtoId" = p.id
      GROUP BY p.id, p.descricao, p.categoria, p.preco
      ORDER BY SUM(iv.quantidade) DESC
      LIMIT ${limite}
    `;
    return produtos;
  }

  /**
   * Top clientes por valor total de compras
   */
  async topClientes(limite: number = 10) {
    const clientes = await this.prisma.$queryRaw<any[]>`
      SELECT u.id, u.nome, u.email, u.documento, u.natureza,
             COUNT(v.id)::text as total_pedidos,
             COALESCE(SUM(v.valor), 0)::text as valor_total
      FROM "Usuario" u
      LEFT JOIN "Vendas" v ON v."usuarioId" = u.id
      WHERE u.ativo = true
      GROUP BY u.id, u.nome, u.email, u.documento, u.natureza
      ORDER BY COALESCE(SUM(v.valor), 0) DESC
      LIMIT ${limite}
    `;
    return clientes;
  }

  async receitaPorCategoria() {
    const receita = await this.prisma.$queryRaw<any[]>`
      SELECT p.categoria,
             COUNT(DISTINCT iv."vendaId")::text as total_vendas,
             SUM(iv.quantidade)::text as total_itens,
             SUM(iv."valorTotal")::text as receita_total
      FROM "itens_vendas" iv
      INNER JOIN "Produto" p ON iv."produtoId" = p.id
      GROUP BY p.categoria
      ORDER BY SUM(iv."valorTotal") DESC
    `;
    return receita;
  }

  async produtosEstoqueBaixo(limiteEstoque: number = 10) {
    const produtos = await this.prisma.produto.findMany({
      where: {
        ativo: true,
        estoque: {
          lte: limiteEstoque,
        },
      },
      orderBy: {
        estoque: 'asc',
      },
    });
    return produtos;
  }

  /**
   * Vendas por dia (últimos N dias)
   */
  async vendasPorDia(dias: number = 30) {
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - dias);

    const vendas = await this.prisma.vendas.findMany({
      where: {
        data: {
          gte: dataInicio,
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
      const key = venda.data.toISOString().slice(0, 10); // "2025-11-25"

      if (!grupos[key]) {
        grupos[key] = { receita: 0, transacoes: 0 };
      }

      grupos[key].receita += venda.valor;
      grupos[key].transacoes += 1;
    }

    return Object.entries(grupos).map(([dia, dados]) => ({
      dia,
      receita: parseFloat(dados.receita.toFixed(2)),
      transacoes: dados.transacoes,
    }));
  }

  /**
   * Resumo geral para a página de relatórios
   */
  async resumoRelatorios() {
    const totalVendas = await this.prisma.vendas.count();
    const valorTotalAgg = await this.prisma.vendas.aggregate({
      _sum: { valor: true },
    });
    const valorTotal = valorTotalAgg._sum.valor || 0;
    const ticketMedio = totalVendas > 0 ? valorTotal / totalVendas : 0;

    const totalClientes = await this.prisma.usuario.count({
      where: { ativo: true },
    });
    const totalProdutos = await this.prisma.produto.count({
      where: { ativo: true },
    });

    // Vendas últimos 30 dias
    const data30 = new Date();
    data30.setDate(data30.getDate() - 30);
    const vendas30 = await this.prisma.vendas.aggregate({
      _sum: { valor: true },
      _count: { id: true },
      where: { data: { gte: data30 } },
    });

    // Vendas 30 dias anteriores (para comparar crescimento)
    const data60 = new Date();
    data60.setDate(data60.getDate() - 60);
    const vendasAnterior = await this.prisma.vendas.aggregate({
      _sum: { valor: true },
      where: {
        data: { gte: data60, lt: data30 },
      },
    });

    const receita30 = vendas30._sum.valor || 0;
    const receitaAnterior = vendasAnterior._sum.valor || 0;
    const crescimento =
      receitaAnterior > 0
        ? ((receita30 - receitaAnterior) / receitaAnterior) * 100
        : 0;

    return {
      totalVendas,
      valorTotal: parseFloat(valorTotal.toFixed(2)),
      ticketMedio: parseFloat(ticketMedio.toFixed(2)),
      totalClientes,
      totalProdutos,
      receita30dias: parseFloat(receita30.toFixed(2)),
      transacoes30dias: vendas30._count.id,
      crescimento: parseFloat(crescimento.toFixed(2)),
    };
  }

  /**
   * Vendas por dia da semana
   */
  async vendasPorDiaSemana() {
    const resultado = await this.prisma.$queryRaw<any[]>`
      SELECT EXTRACT(DOW FROM data) as dia_semana,
             COUNT(*)::text as total_vendas,
             COALESCE(SUM(valor), 0)::text as receita
      FROM "Vendas"
      GROUP BY EXTRACT(DOW FROM data)
      ORDER BY EXTRACT(DOW FROM data)
    `;
    const diasNomes = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];
    return resultado.map((r) => ({
      dia: diasNomes[Number(r.dia_semana)],
      totalVendas: Number(r.total_vendas),
      receita: parseFloat(Number(r.receita).toFixed(2)),
    }));
  }

  /**
   * Clientes novos por mês
   */
  async clientesNovosPorMes(meses: number = 6) {
    const dataInicio = new Date();
    dataInicio.setMonth(dataInicio.getMonth() - meses);

    const usuarios = await this.prisma.$queryRaw<any[]>`
      SELECT TO_CHAR(v.data, 'YYYY-MM') as mes,
             COUNT(DISTINCT v."usuarioId")::text as clientes_compradores
      FROM "Vendas" v
      WHERE v.data >= ${dataInicio}
      GROUP BY TO_CHAR(v.data, 'YYYY-MM')
      ORDER BY mes
    `;
    return usuarios;
  }
}
