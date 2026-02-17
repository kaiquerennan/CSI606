import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Produto } from '../../generated/prisma';

@Injectable()
export class ProdutosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Produto[]> {
    return this.prisma.produto.findMany();
  }

  async findById(id): Promise<Produto | null> {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
    });

    if (!produto) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    return produto;
  }

  async delete(id): Promise<Produto | null> {
    return this.prisma.produto.delete({
      where: { id },
    });
  }

  async create(data: {
    descricao: string;
    preco: number;
    grupo: string;
    estoque: number | any; // Permite number ou Decimal
    ativo: boolean;
    categoria: string;
  }): Promise<Produto> {
    return this.prisma.produto.create({
      data: {
        ...data,
        estoque: Number(data.estoque), // Garante que seja numérico
      },
    });
  }

  async update(id: number, data: Partial<Produto>): Promise<Produto> {
    const produto = await this.prisma.produto.findUnique({ where: { id } });

    if (!produto) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }

    return this.prisma.produto.update({
      where: { id },
      data: {
        ...data,
        estoque: data.estoque ? Number(data.estoque) : undefined,
      },
    });
  }
}
