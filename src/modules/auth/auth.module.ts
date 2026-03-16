import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { LoginStrategy } from './strategies/login.strategy';
import { APP_GUARD } from '@nestjs/core';
import jwtConfig from './config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';
import { UserModule } from '../user/user.module';

@Module({
  
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginStrategy,
    JwtStrategy,
   
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    UserModule
  ],
})
export class AuthModule {}
