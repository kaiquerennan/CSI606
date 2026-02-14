import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendasService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, perPage: number = 20, status?: string) {
    const skip = (page - 1) * perPage;
    const take = perPage;

    const where = status ? { status } : {};

    const [vendas, total] = await Promise.all([
      this.prisma.vendas.findMany({
        where,
        skip,
        take,
        include: {
          usuario: {
            select: { id: true, nome: true, email: true },
          },
          itens: {
            include: {
              produto: {
                select: { id: true, descricao: true, categoria: true },
              },
            },
          },
        },
        orderBy: { data: 'desc' },
      }),
      this.prisma.vendas.count({ where }),
    ]);

    return {
      vendas,
      total,
      page,
      perPage,
    };
  }

  async findById(id: number) {
    return this.prisma.vendas.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { id: true, nome: true, email: true },
        },
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                descricao: true,
                categoria: true,
                preco: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: {
    clienteId: number;
    itens: {
      produtoId: number;
      quantidade: number;
    }[];
  }) {
    if (!data.itens || data.itens.length === 0) {
      throw new BadRequestException('A venda deve ter pelo menos um item');
    }

    // Buscar produtos e validar estoque
    const produtoIds = data.itens.map((i) => i.produtoId);
    const produtos = await this.prisma.produto.findMany({
      where: { id: { in: produtoIds } },
    });

    const produtoMap = new Map(produtos.map((p) => [p.id, p]));

    // Validar
    for (const item of data.itens) {
      const produto = produtoMap.get(item.produtoId);
      if (!produto) {
        throw new BadRequestException(
          `Produto ${item.produtoId} não encontrado`,
        );
      }
      if (!produto.ativo) {
        throw new BadRequestException(
          `Produto "${produto.descricao}" está inativo`,
        );
      }
      if (Number(produto.estoque) < item.quantidade) {
        throw new BadRequestException(
          `Estoque insuficiente para "${produto.descricao}". Disponível: ${produto.estoque}`,
        );
      }
    }

    // Calcular valores
    const itensComValor = data.itens.map((item) => {
      const produto = produtoMap.get(item.produtoId)!;
      const valorUnitario = produto.preco;
      const valorTotal = valorUnitario * item.quantidade;
      return {
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        valorUnitario,
        valorTotal,
      };
    });

    const valorTotalVenda = itensComValor.reduce(
      (acc, item) => acc + item.valorTotal,
      0,
    );

    // Criar venda em transação
    const venda = await this.prisma.$transaction(async (tx) => {
      // 1. Criar a venda
      const novaVenda = await tx.vendas.create({
        data: {
          valor: valorTotalVenda,
          status: 'concluida',
          usuarioId: data.clienteId,
          itens: {
            create: itensComValor.map((item) => ({
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              valorUnitario: item.valorUnitario,
              valorTotal: item.valorTotal,
            })),
          },
        },
        include: {
          usuario: {
            select: { id: true, nome: true },
          },
          itens: {
            include: {
              produto: {
                select: { id: true, descricao: true },
              },
            },
          },
        },
      });

      // 2. Decrementar estoque
      for (const item of itensComValor) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: {
              decrement: item.quantidade,
            },
          },
        });
      }

      return novaVenda;
    });

    return venda;
  }

  async cancelar(id: number) {
    const venda = await this.prisma.vendas.findUnique({
      where: { id },
      include: { itens: true },
    });

    if (!venda) {
      throw new BadRequestException('Venda não encontrada');
    }

    if (venda.status === 'excluida') {
      throw new BadRequestException('Venda já foi cancelada');
    }

    // Reverter estoque e atualizar status
    await this.prisma.$transaction(async (tx) => {
      for (const item of venda.itens) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoque: {
              increment: Number(item.quantidade),
            },
          },
        });
      }

      await tx.vendas.update({
        where: { id },
        data: { status: 'excluida' },
      });
    });

    return { message: 'Venda cancelada com sucesso' };
  }
}
