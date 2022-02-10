import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { CurrentUser } from './types/security.types';
import UserModel from '../user/models/user.model';
import UserSessionModel from './models/userSession.model';

@Injectable()
export default class SecurityService {
  @Inject('sequelize') sequelize: Sequelize;
  @Inject('userSessionRepository')
  userSessionRepository: typeof UserSessionModel;
  @Inject('userRepository') userRepository: typeof UserModel;
  @Inject() jwtService: JwtService;

  async validateCredentials(
    username: string,
    password: string,
  ): Promise<UserModel['id']> {
    const user = await this.userRepository.findOne({
      where: { username },
      attributes: ['id', 'passwordHash'],
    });
    if (!user) {
      return null;
    }
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return null;
    }
    return user.id;
  }

  async getCurrentUserByJwtUserId(userId: number) {
    const count = await this.userSessionRepository.count({ where: { userId } });
    if (!count) {
      throw new UnauthorizedException();
    }

    const currentUser = await this.getCurrentUserById(userId);
    if (!currentUser) {
      throw new UnauthorizedException();
    }

    return currentUser;
  }

  async getCurrentUserById(id: UserModel['id']): Promise<CurrentUser> {
    const [user, activeSessions] = await Promise.all([
      this.userRepository.findByPk(id),
      this.countActiveUserSessions(id),
    ]);
    if (!user) {
      return null;
    }
    return CurrentUser.fromRepository(user, activeSessions);
  }

  generateToken(userId: number): Promise<string> {
    return this.jwtService.signAsync({ userId });
  }

  countActiveUserSessions(userId): Promise<any> {
    return this.userSessionRepository.count({ where: { userId } });
  }

  async createUserSession(userId, token): Promise<any> {
    await this.userSessionRepository.create({ userId, token });
  }

  async removeUserSession(userId: number, token: string): Promise<void> {
    await this.userSessionRepository.destroy({ where: { userId, token } });
  }

  async removeAllUserSessions(userId: number): Promise<void> {
    await this.userSessionRepository.destroy({ where: { userId } });
  }
}
