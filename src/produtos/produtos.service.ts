import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Produto } from '@prisma/client';

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
}
