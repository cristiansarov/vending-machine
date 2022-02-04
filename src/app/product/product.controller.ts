import { Body, Controller, Delete, ForbiddenException, Get, Inject, Param, Post, Put, Req } from '@nestjs/common';
import ProductService from './product.service';
import { ProductDetails } from './types/product.controllerTypes';
import { Authenticated } from '../security/decorators/security.decorators';
import { UserRoles } from '../user/types/user.types';
import { Request } from 'express';


@Controller('/product')
export default class ProductController {
  @Inject() private readonly productService: ProductService;

  @Authenticated({ oneOfRoles: [UserRoles.seller] })
  @Post('/')
  createProduct(@Body() body: ProductDetails, @Req() req: Request) {
    return this.productService.createProduct(body, req.user.id);
  }

  @Authenticated()
  @Get('/')
  getProducts() {
    return this.productService.getProducts();
  }

  @Authenticated()
  @Get('/:productId')
  getProduct(@Param('productId') productId: string) {
    return this.productService.getProduct(parseInt(productId));
  }

  @Authenticated({ oneOfRoles: [UserRoles.seller] })
  @Put('/:productId')
  async updateProduct(@Param('productId') productId: string, @Body() body: ProductDetails, @Req() req: Request) {
    const isProductOwnedBySeller = await this.productService.checkIfProductOwnedBySeller(parseInt(productId), req.user.id);
    if (!isProductOwnedBySeller) {
      throw new ForbiddenException('The current user does not own the product');
    }
    return this.productService.updateProduct(parseInt(productId), body);
  }

  @Authenticated({ oneOfRoles: [UserRoles.seller] })
  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: string, @Req() req: Request) {
    const isProductOwnedBySeller = await this.productService.checkIfProductOwnedBySeller(parseInt(productId), req.user.id);
    if (!isProductOwnedBySeller) {
      throw new ForbiddenException('The current user does not own the product');
    }
    return this.productService.deleteProduct(parseInt(productId));
  }
}
