import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './src/clientes/clientes.module';
import { DashboardModule } from './src/dashboard/dashboard.module';
import { ProdutosModule } from './src/produtos/produtos.module';
import { AuthModule } from './src/auth/auth.module';

@Module({
  imports: [ClientesModule, DashboardModule, ProdutosModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
