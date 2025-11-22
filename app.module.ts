import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './src/users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { DashboardModule } from './src/dashboard/dashboard.module';

@Module({
  imports: [UsersModule, DashboardModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
