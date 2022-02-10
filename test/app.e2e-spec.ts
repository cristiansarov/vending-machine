import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as supertest from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app/app.module';
import { initDatabase, loginAndGetCookie } from './test.utils';
import UserService from '../src/app/user/user.service';
import UserModel from '../src/app/user/models/user.model';
import { LoginRequest } from '../src/app/security/types/security.controllerTypes';
import { ProductDetails } from '../src/app/product/types/product.controllerTypes';
import ProductService from '../src/app/product/product.service';
import VendingService from '../src/app/vending/vending.service';
import ProductModel from '../src/app/product/models/product.model';

describe('app', () => {
  let app: INestApplication;
  let requester: supertest.SuperTest<supertest.Test>;
  let userService: UserService;
  let userRepository: typeof UserModel;
  let productService: ProductService;
  let productRepository: typeof ProductModel;
  let vendingService: VendingService;
  let buyerUserId: number;
  let sellerUserId: number;
  const buyerCredentials: LoginRequest = { username: 'buyer', password: 'test' };
  const sellerCredentials: LoginRequest = { username: 'seller', password: 'test' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser())
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    await initDatabase();
    await app.init();

    requester = supertest(app.getHttpServer());
    userService = await app.resolve(UserService);
    userRepository = await app.resolve<typeof UserModel>('userRepository');
    productService = await app.resolve(ProductService);
    productRepository = await app.resolve<typeof ProductModel>('productRepository');
    vendingService = await app.resolve(VendingService);

    buyerUserId = await userService.createUser(buyerCredentials);
    sellerUserId = await userService.createUser(sellerCredentials, true);
  });

  afterEach(async () => {
    await vendingService.withdraw(buyerUserId);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /vending/deposit', () => {
    const correctAmount = 10;
    const incorrectAmount = 7;

    it('It should fail the deposit if not logged in', async () => {
      const response = await requester.post('/vending/deposit').send({ amount: correctAmount })

      expect(response.statusCode).toBe(401);
    });

    it('It should fail the deposit if the user role is wrong', async () => {
      const cookie = await loginAndGetCookie(requester, sellerCredentials);

      const response = await requester.post('/vending/deposit').set('Cookie', cookie).send({ amount: incorrectAmount })

      expect(response.statusCode).toBe(403);
    });

    it('It should fail the deposit if the amount is wrong', async () => {
      const cookie = await loginAndGetCookie(requester, buyerCredentials);

      const response = await requester.post('/vending/deposit').set('Cookie', cookie).send({ amount: incorrectAmount })

      expect(response.statusCode).toBe(400);
    });

    it('It should successfully deposit the amount of money', async () => {
      const cookie = await loginAndGetCookie(requester, buyerCredentials);

      const response = await requester.post('/vending/deposit').set('Cookie', cookie).send({ amount: correctAmount })

      expect(response.statusCode).toBe(204);
      const {deposit} = await userRepository.findByPk(buyerUserId)
      expect(deposit).toBe(correctAmount);
    });
  });

  describe('POST /vending/buy', () => {
    let createdProductId: number;
    const amountDeposited = 100;
    const productDetails: ProductDetails = {
      productName: 'Mars',
      cost: 15,
      amountAvailable: 20,
    };

    beforeAll(async () => {
      createdProductId = await productService.createProduct(productDetails, sellerUserId);
    });

    afterEach(async () => {
      await productService.updateProduct(createdProductId, productDetails);
    });

    it('It should fail buying the product if not logged in', async () => {
      const response = await requester.post('/vending/buy').send({ productId: createdProductId, amount: 1 })

      expect(response.statusCode).toBe(401);
    });

    it('It should fail buying the product if the user role is wrong', async () => {
      const cookie = await loginAndGetCookie(requester, sellerCredentials);

      const response = await requester.post('/vending/buy').set('Cookie', cookie).send({ productId: createdProductId, amount: 1 })

      expect(response.statusCode).toBe(403);
    });

    it('It should fail buying the product if no money deposited', async () => {
      const cookie = await loginAndGetCookie(requester, buyerCredentials);

      const response = await requester.post('/vending/buy').set('Cookie', cookie).send({ productId: createdProductId, amount: 1 })

      expect(response.statusCode).toBe(400);
    });

    it('It should fail buying the product if the request body is wrong', async () => {
      const cookie = await loginAndGetCookie(requester, buyerCredentials);
      await requester.post('/vending/deposit').set('Cookie', cookie).send({ amount: amountDeposited })

      const response = await requester.post('/vending/buy').set('Cookie', cookie).send({ randomStuff: true })

      expect(response.statusCode).toBe(400);
    });

    it('It should successfully buy the product', async () => {
      const cookie = await loginAndGetCookie(requester, buyerCredentials);
      await requester.post('/vending/deposit').set('Cookie', cookie).send({ amount: amountDeposited })

      const response = await requester.post('/vending/buy').set('Cookie', cookie).send({ productId: createdProductId, amount: 1 })

      expect(response.statusCode).toBe(200);
      expect(response.body.totalSpent).toBe(productDetails.cost);
      expect(response.body.amountRemaining).toBe(amountDeposited - productDetails.cost);
      const product = await productRepository.findByPk(createdProductId, { raw: true })
      expect(product).toStrictEqual({
        ...productDetails,
        id: createdProductId,
        amountAvailable: productDetails.amountAvailable - 1,
        sellerId: sellerUserId,
      });
    });
  });

  describe('POST /product/create', () => {
    const productDetails: ProductDetails = {
      productName: 'Snickers',
      cost: 10,
      amountAvailable: 20,
    };

    it('It should fail creating the product if not logged in', async () => {
      const response = await requester.post('/product').send(productDetails)

      expect(response.statusCode).toBe(401);
    });

    it('It should fail creating the product if the role is wrong', async () => {
      const cookie = await loginAndGetCookie(requester, buyerCredentials);

      const response = await requester.post('/product').set('Cookie', cookie).send(productDetails)

      expect(response.statusCode).toBe(403);
    });

    it('It should fail creating the product if the body is wrong', async () => {
      const cookie = await loginAndGetCookie(requester, sellerCredentials);

      const response = await requester.post('/product').set('Cookie', cookie).send({ randomStuff: true })

      expect(response.statusCode).toBe(400);
    });

    it('It should successfully create the product', async () => {
      const cookie = await loginAndGetCookie(requester, sellerCredentials);

      const response = await requester.post('/product').set('Cookie', cookie).send(productDetails)

      expect(response.statusCode).toBe(201);
      const productId = parseInt(response.text);
      expect(productId).not.toBeNaN();
      const product = await productRepository.findByPk(productId, { raw: true })
      expect(product).toStrictEqual({
        ...productDetails,
        id: productId,
        sellerId: sellerUserId,
      });
    });
  });
});
