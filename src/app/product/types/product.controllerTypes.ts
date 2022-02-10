import ProductModel from '../models/product.model';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { UProductListItem } from '../../../global/universal.types';

export class ProductDetails {
  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @IsNotEmpty()
  @IsNumber()
  amountAvailable: number;

  constructor(props: ProductDetails) {
    Object.assign(this, props);
  }

  static fromRepository(props: ProductModel) {
    return new ProductDetails({
      productName: props.productName,
      cost: props.cost,
      amountAvailable: props.amountAvailable,
    });
  }
}

export class ProductListItem implements UProductListItem {
  id: number;
  productName: string;
  cost: number;
  amountAvailable: number;

  constructor(props: ProductListItem) {
    Object.assign(this, props);
  }

  static fromRepository(props: ProductModel) {
    return new ProductListItem({
      id: props.id,
      productName: props.productName,
      cost: props.cost,
      amountAvailable: props.amountAvailable,
    });
  }
}
