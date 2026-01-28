import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

@Controller('sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; senha: string }) {
    const user = await this.prisma.usuario.findUnique({
      where: { email: body.email },
    });
    if (!user || !user.senha) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const isPasswordValid = await bcrypt.compare(body.senha, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const payload = { sub: user.id, email: user.email };
    const token = this.jwt.sign(payload);
    return { token };
  }

  @Post('generate-token')
  async generateToken(@Body() body: { userId: number }) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: body.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const payload = { sub: user.id, email: user.email };
    const token = this.jwt.sign(payload);
    return { token };
  }
}
