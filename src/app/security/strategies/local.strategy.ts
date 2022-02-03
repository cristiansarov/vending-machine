import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CurrentUser } from '../types/security.types';
import SecurityService from '../security.service';


@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject() securityService: SecurityService;

  constructor() {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<CurrentUser> {
    const userId = await this.securityService.validateCredentials(username, password);
    if (!userId) {
      throw new BadRequestException();
    }
    const currentUser = this.securityService.getCurrentUserById(userId);
    if (!currentUser) {
      throw new BadRequestException();
    }
    return currentUser;
  }
}
