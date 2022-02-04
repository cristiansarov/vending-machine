import {
  IsEnum,
  IsNotEmpty, IsNumber,
} from 'class-validator';
import { depositAmountList } from './vending.constants';

export class DepositRequest {
  @IsNotEmpty()
  @IsEnum(depositAmountList, { message: `It must be one of ${depositAmountList.join(', ')}` })
  amount: number;
}

export class GetDepositResponse {
  deposit: number;
}

export class BuyRequest {
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

export class ResetResponse {
  coinsReturned: number[];
}

