import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Usuario } from '../../generated/prisma';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  //Só usuarios ativos
  async findAll(): Promise<Usuario[]> {
    return this.prisma.usuario.findMany({
      where: {
        ativo: true,
      },
    });
  }

  async findById(id: number): Promise<Usuario | null> {
    const cliente = await this.prisma.usuario.findUnique({ where: { id } });

    if (!cliente) {
      throw new NotFoundException(`Cliente ${id} não encontrado`);
    }
    return cliente;
  }

  async create(data: {
    nome: string;
    email: string;
    documento: string;
    natureza?: string;
    ativo?: boolean;
    senha?: string;
    dataNascimento?: string;
  }): Promise<Usuario> {
    return this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        documento: data.documento,
        ativo: data.ativo ?? true,
        natureza: data.natureza ?? 'Física',
        dataNascimento: data.dataNascimento ?? '',
      },
    });
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const cliente = await this.prisma.usuario.findUnique({ where: { id } });

    if (!cliente) {
      throw new NotFoundException(`Cliente ${id} não encontrado`);
    }

    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Usuario | null> {
    return await this.prisma.usuario.delete({
      where: { id },
    });
  }
}
