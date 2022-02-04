import { Body, Controller, Get, HttpCode, Inject, Param, Post, Req } from '@nestjs/common';
import VendingService from './vending.service';
import { Authenticated } from '../security/decorators/security.decorators';
import { UserRoles } from '../user/types/user.types';
import { Request } from 'express';
import { BuyRequest, DepositRequest } from './types/vending.controllerTypes';


@Authenticated({ oneOfRoles: [UserRoles.buyer] })
@Controller('/vending')
export default class VendingController {
  @Inject() private readonly vendingService: VendingService;

  @Get('/deposit')
  getDepositAmount(@Req() req: Request) {
    return this.vendingService.getDepositAmount(req.user.id);
  }

  @Post('/deposit')
  @HttpCode(204)
  deposit(@Body() body: DepositRequest, @Req() req: Request) {
    return this.vendingService.deposit(body, req.user.id);
  }

  @Post('/buy')
  buyProduct(@Body() body: BuyRequest, @Req() req: Request) {
    return this.vendingService.buyProduct(body, req.user.id);
  }

  @Post('/reset')
  resetDeposit(@Req() req: Request) {
    return this.vendingService.resetDeposit(req.user.id);
  }
}
