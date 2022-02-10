import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import {
  depositAmountList,
  UBuyRequest,
  UDepositRequest,
  UGetDepositResponse,
  UWithdrawResponse,
} from '../../../global/universal.types';

export class DepositRequest implements UDepositRequest {
  @IsNotEmpty()
  @IsEnum(depositAmountList, {
    message: `It must be one of ${depositAmountList.join(', ')}`,
  })
  amount: number;
}

export class GetDepositResponse implements UGetDepositResponse {
  deposit: number;
}

export class BuyRequest implements UBuyRequest {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class BuyResponse {
  totalSpent: number;
  amountRemaining: number;
}

export class WithdrawResponse implements UWithdrawResponse {
  coinsReturned: number[];
}
