import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendasService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, perPage: number = 20, status?: string) {
    const skip = (page - 1) * perPage;
    const take = perPage;

    const where = status ? { status } : {};

    const vendas = await this.prisma.vendas.findMany({
      where: { status },
      skip,
      take,
    });

    return {
      vendas,
      page,
      perPage,
    };
  }
}
