import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './src/users/clientes.module';
import { PrismaService } from './src/prisma/prisma.service';
import { DashboardModule } from './src/dashboard/dashboard.module';
import { ProdutosModule } from './src/produtos/produtos.module';

@Module({
  imports: [ClientesModule, DashboardModule, ProdutosModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
