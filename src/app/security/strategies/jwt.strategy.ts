import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { config } from 'node-config-ts';
import { CurrentUser, JwtTokenPayload } from '../types/security.types';
import SecurityService from '../security.service';
import UserSessionModel from '../models/userSession.model';
import { Request } from 'express';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject() private readonly securityService: SecurityService;
  @Inject('userSessionRepository')
  private readonly userSessionRepository: typeof UserSessionModel;

  constructor() {
    super({
      jwtFromRequest: (req: Request) => req.cookies?.authToken,
      ignoreExpiration: false,
      secretOrKey: config.authToken.secret,
      passReqToCallback: true,
    });
  }

  async validate(req, { userId }: JwtTokenPayload): Promise<CurrentUser> {
    return this.securityService.getCurrentUserByJwtUserId(userId);
  }
}
