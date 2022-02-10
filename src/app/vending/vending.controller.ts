import { Body, Controller, Get, HttpCode, Inject, Param, Post, Req } from '@nestjs/common';
import VendingService from './vending.service';
import { Authenticated } from '../security/decorators/security.decorators';
import { Request } from 'express';
import { BuyRequest, DepositRequest } from './types/vending.controllerTypes';
import { UserRoles } from '../../global/universal.types';


@Authenticated({ oneOfRoles: [UserRoles.buyer] })
@Controller('/vending')
export default class VendingController {
  @Inject() private readonly vendingService: VendingService;

  @Get('/deposit')
  @HttpCode(200)
  getDepositAmount(@Req() req: Request) {
    return this.vendingService.getDepositAmount(req.user.id);
  }

  @Post('/deposit')
  @HttpCode(204)
  deposit(@Body() body: DepositRequest, @Req() req: Request) {
    return this.vendingService.deposit(body, req.user.id);
  }

  @Post('/buy')
  @HttpCode(200)
  buyProduct(@Body() body: BuyRequest, @Req() req: Request) {
    return this.vendingService.buyProduct(body, req.user.id);
  }

  @Post('/reset')
  @HttpCode(200)
  withdraw(@Req() req: Request) {
    return this.vendingService.withdraw(req.user.id);
  }
}
