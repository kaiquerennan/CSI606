import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, senha: string) {
    const admin = await this.prisma.administrador.findUnique({
      where: { email },
    });

    if (!admin || !admin.ativo) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Retorna os dados do admin sem a senha
    const { senha: _, ...adminSemSenha } = admin;
    return adminSemSenha;
  }

  async findAll() {
    return this.prisma.administrador.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true,
        criadoEm: true,
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async findById(id: number) {
    const admin = await this.prisma.administrador.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true,
        criadoEm: true,
      },
    });

    if (!admin) {
      throw new NotFoundException(`Administrador ${id} não encontrado`);
    }

    return admin;
  }

  async create(data: { nome: string; email: string; senha: string }) {
    const existente = await this.prisma.administrador.findUnique({
      where: { email: data.email },
    });

    if (existente) {
      throw new ConflictException('Já existe um administrador com este email');
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const admin = await this.prisma.administrador.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: senhaHash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true,
        criadoEm: true,
      },
    });

    return admin;
  }

  async update(
    id: number,
    data: { nome?: string; email?: string; senha?: string; ativo?: boolean },
  ) {
    const admin = await this.prisma.administrador.findUnique({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException(`Administrador ${id} não encontrado`);
    }

    const updateData: any = {};
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.ativo !== undefined) updateData.ativo = data.ativo;
    if (data.senha) {
      updateData.senha = await bcrypt.hash(data.senha, 10);
    }

    return this.prisma.administrador.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        ativo: true,
        criadoEm: true,
      },
    });
  }

  async delete(id: number) {
    const admin = await this.prisma.administrador.findUnique({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException(`Administrador ${id} não encontrado`);
    }

    await this.prisma.administrador.delete({ where: { id } });
    return { message: 'Administrador removido com sucesso' };
  }
}
