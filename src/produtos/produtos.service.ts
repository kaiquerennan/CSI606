import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Produto } from '@prisma/client';

@Injectable()
export class ProdutosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Produto[]> {
    return this.prisma.produto.findMany();
  }

  async findById(id): Promise<Produto | null> {
    return this.prisma.produto.findUnique({
      where: { id },
    });
  }

  async delete(id): Promise<Produto | null> {
    return this.prisma.produto.delete({
      where: { id },
    });
  }
}
