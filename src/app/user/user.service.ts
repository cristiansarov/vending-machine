import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import UserModel from './models/user.model';
import SecurityService from '../security/security.service';
import { UserListItem, UserDetails, UserRegistrationDetails } from './types/user.controllerTypes';
import { UserRoles } from '../../global/universal.types';


@Injectable()
export default class UserService {
  @Inject('sequelize') private readonly sequelize: Sequelize;
  @Inject('userRepository') private readonly userRepository: typeof UserModel;
  @Inject() private readonly securityService: SecurityService;
  @Inject() jwtService: JwtService;

  async createUser({ password, ...body }: UserRegistrationDetails, isSeller?: boolean): Promise<number> {
    try {
      const passwordHash = await bcrypt.hash(password, bcrypt.genSaltSync());
      const userDetails: Partial<UserModel> = { passwordHash, ...body };
      if (isSeller) {
        userDetails.role = UserRoles.seller;
      }
      const { id } = await this.userRepository.create(userDetails);
      return id;
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('The username is taken by another user');
      }
      throw e;
    }
  }

  async getUsers(): Promise<UserListItem[]> {
    const users = await this.userRepository.findAll();
    return users.map(UserListItem.fromRepository);
  }

  async getUser(userId: number): Promise<UserDetails> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return UserDetails.fromRepository(user);
  }

  async updateUser(userId: number, body: UserDetails): Promise<void> {
    try {
      const user = await this.userRepository.findByPk(userId);
      if (!user) {
        throw new NotFoundException();
      }
      let passwordHash = user.passwordHash;
      if (body.password) {
        passwordHash = await bcrypt.hash(body.password, bcrypt.genSaltSync());
      }
      delete body.password;
      await user.update({ ...body, passwordHash });
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('The username is taken by another user');
      }
      throw e;
    }
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) {
      throw new NotFoundException('The user does not exist');
    }
    await user.destroy();
  }
}
