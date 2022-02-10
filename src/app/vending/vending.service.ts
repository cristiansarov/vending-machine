import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import ProductModel from '../product/models/product.model';
import {
  BuyRequest,
  BuyResponse,
  DepositRequest,
  GetDepositResponse,
  WithdrawResponse,
} from './types/vending.controllerTypes';
import UserService from '../user/user.service';
import UserModel from '../user/models/user.model';
import { depositAmountList } from '../../global/universal.types';

@Injectable()
export default class VendingService {
  @Inject('sequelize') private readonly sequelize: Sequelize;
  @Inject('productRepository')
  private readonly productRepository: typeof ProductModel;
  @Inject('userRepository') private readonly userRepository: typeof UserModel;
  @Inject() private readonly userService: UserService;

  async getDepositAmount(userId: number): Promise<GetDepositResponse> {
    const user = await this.userRepository.findByPk(userId);
    return { deposit: user.deposit };
  }

  async deposit({ amount }: DepositRequest, userId: number): Promise<void> {
    const user = await this.userRepository.findByPk(userId);
    await user.update({ deposit: user.deposit + amount });
  }

  buyProduct(
    { productId, amount }: BuyRequest,
    userId: number,
  ): Promise<BuyResponse> {
    return this.sequelize.transaction(async (transaction) => {
      const [product, user] = await Promise.all([
        this.productRepository.findByPk(productId, { lock: true, transaction }),
        this.userRepository.findByPk(userId, { transaction }),
      ]);

      if (!product) {
        throw new NotFoundException();
      }
      const totalCost = product.cost * amount;
      if (user.deposit < totalCost) {
        throw new BadRequestException(
          "You don't have enough money in your deposit",
        );
      }
      if (product.amountAvailable < amount) {
        throw new BadRequestException('The product does not have enough stock');
      }

      await Promise.all([
        user.decrement({ deposit: totalCost }, { transaction }),
        product.decrement({ amountAvailable: amount }, { transaction }),
      ]);

      return {
        totalSpent: totalCost,
        amountRemaining: user.deposit - totalCost,
      };
    });
  }

  async withdraw(userId: number): Promise<WithdrawResponse> {
    const user = await this.userRepository.findByPk(userId);
    const coinsReturned = this.getCoinsFromDeposit(user.deposit);
    await user.update({ deposit: 0 });
    return { coinsReturned };
  }

  private getCoinsFromDeposit(deposit: number): number[] {
    const reverseCoinList = depositAmountList.sort((a, b) => (a > b ? -1 : 1));
    const finalCoinList = [];
    let oldDeposit = deposit;
    for (const coin of reverseCoinList) {
      while (coin <= oldDeposit) {
        oldDeposit -= coin;
        finalCoinList.push(coin);
      }
    }
    return finalCoinList;
  }
}
