import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as config from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from '../auth.service';
import jwtConfig from '../config/jwt.config';
import { AuthJwtPayload } from '../types/auth.jwtpayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-strategy') {
  constructor(
    @Inject(jwtConfig.KEY) private jwtConf: config.ConfigType<typeof jwtConfig>,

    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConf.secret as string,
    });
  }

  async validate(paylod: AuthJwtPayload) {
    return this.authService.validJwtUser(paylod.sub);
  }
}
