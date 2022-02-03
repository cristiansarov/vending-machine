import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import SecurityService from '../security/security.service';
import ProductModel from '../product/models/product.model';
import { ProductDetails, ProductListItem } from './types/product.controllerTypes';


@Injectable()
export default class ProductService {
  @Inject('sequelize') private readonly sequelize: Sequelize;
  @Inject('productRepository') private readonly productRepository: typeof ProductModel;
  @Inject() private readonly securityService: SecurityService;

  async createProduct(body: ProductDetails, sellerId: number): Promise<number> {
    const { id } = await this.productRepository.create({ ...body, sellerId });
    return id;
  }

  async getProducts(): Promise<ProductListItem[]> {
    const products = await this.productRepository.findAll();
    return products.map(ProductListItem.fromRepository);
  }

  async getProduct(productId: number): Promise<ProductDetails> {
    const product = await this.productRepository.findByPk(productId)
    return ProductDetails.fromRepository(product);
  }

  async checkIfProductOwnedBySeller(productId: number, sellerId: number): Promise<boolean> {
    const product = await this.productRepository.findByPk(productId, { attributes: ['sellerId'] });
    if (!product) {
      throw new NotFoundException();
    }
    return product.sellerId === sellerId;
  }

  async updateProduct(productId: number, body: ProductDetails): Promise<void> {
    const product = await this.productRepository.findByPk(productId);
    if (!product) {
      throw new NotFoundException();
    }
    await product.update(body);
  }

  async deleteProduct(productId: number): Promise<void> {
    const product = await this.productRepository.findByPk(productId);
    if (!product) {
      throw new NotFoundException('The product does not exist');
    }
    await product.destroy();
  }
}
