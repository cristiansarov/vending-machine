import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'node-config-ts';
import UserController from './user/user.controller';
import UserService from './user/user.service';
import sequelizeFactory from '../global/services/sequelize.service';
import UserModel from './user/models/user.model';
import UserSessionModel from './security/models/userSession.model';
import ProductModel from './product/models/product.model';
import SecurityService from './security/security.service';
import JwtStrategy from './security/strategies/jwt.strategy';
import LocalStrategy from './security/strategies/local.strategy';
import { SecurityController } from './security/security.controller';


@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: config.authToken.secret,
        signOptions: { expiresIn: config.authToken.expiration },
      }),
    }),
  ],
  controllers: [
    UserController,
    SecurityController,
  ],
  providers: [
    {
      provide: 'sequelize',
      useFactory: sequelizeFactory,
    },
    {
      provide: 'userRepository',
      useValue: UserModel,
    },
    {
      provide: 'userSessionRepository',
      useValue: UserSessionModel,
    },
    {
      provide: 'productRepository',
      useValue: ProductModel,
    },
    JwtStrategy,
    LocalStrategy,
    SecurityService,
    UserService,
  ],
})
export class AppModule {}
