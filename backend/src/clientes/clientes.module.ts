import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService, PrismaService],
})
export class ClientesModule {}
