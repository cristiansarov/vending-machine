import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { config } from 'node-config-ts';
import { ValidationPipe } from '@nestjs/common';

class Main {
  constructor() {
    this.bootstrap().catch((e) => {
      console.error(e.message);
      process.exit(1);
    });
  }

  async bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.listen(config.port);
  }
}

/* eslint-disable-next-line */
new Main();
