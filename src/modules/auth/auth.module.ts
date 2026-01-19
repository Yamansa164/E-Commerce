import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginStrategy } from './strategies/login.strategy';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/prisma/prisma_service';
import { APP_GUARD } from '@nestjs/core';
import jwtConfig from './config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginStrategy,
    JwtStrategy,
    UserService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
})
export class AuthModule {}
