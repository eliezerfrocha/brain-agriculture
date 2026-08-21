import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { DEFAULT_DEV_JWT_SECRET } from '../../../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', DEFAULT_DEV_JWT_SECRET),
    });
  }

  // O retorno vira `request.user` nos controllers protegidos.
  validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email, nome: payload.nome };
  }
}
