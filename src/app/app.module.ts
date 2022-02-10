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
import ProductService from './product/product.service';
import ProductController from './product/product.controller';
import VendingController from './vending/vending.controller';
import VendingService from './vending/vending.service';

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
    ProductController,
    VendingController,
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
    ProductService,
    VendingService,
  ],
})
export class AppModule {}
