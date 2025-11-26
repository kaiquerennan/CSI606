import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Usuario } from '../../generated/prisma';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany();
  }

  async findById(id: number): Promise<Usuario | null> {
    const cliente = await this.prisma.usuario.findUnique({ where: { id } });

    if (!cliente) {
      throw new NotFoundException(`Cliente ${id} não encontrado`);
    }
    return cliente;
  }

  async create(nome: string, email: string): Promise<Usuario> {
    return await this.prisma.usuario.create({
      data: { nome, email },
    });
  }

  async delete(id: number): Promise<Usuario | null> {
    return await this.prisma.usuario.delete({
      where: { id },
    });
  }
}
