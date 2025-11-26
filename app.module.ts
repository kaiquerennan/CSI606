import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientesModule } from './src/users/clientes.module';
import { PrismaService } from './src/prisma/prisma.service';
import { DashboardModule } from './src/dashboard/dashboard.module';

@Module({
  imports: [ClientesModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
