import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthenticateController } from './authenticate.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'salespro-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthenticateController],
  providers: [JwtStrategy],
})
export class AuthModule {}
