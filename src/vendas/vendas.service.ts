import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendasService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    if (!status) {
      return this.prisma.vendas.findMany();
    }
    return this.prisma.vendas.findMany({
      where: {
        status,
      },
    });
  }
}
