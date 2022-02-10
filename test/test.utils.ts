import * as path from 'path';
import * as ST from 'sequelize-typescript';
import { config } from 'node-config-ts';
import { Options } from 'sequelize';
import { LoginRequest } from '../src/app/security/types/security.controllerTypes';
import * as supertest from 'supertest';

export async function initDatabase() {
  const sequelize = new ST.Sequelize(config.database as Options);
  sequelize.addModels([path.join(__dirname, '../src/**/*.model.{ts,js}')]);
  await sequelize.sync({ force: true });
}

export async function loginAndGetCookie(
  request: supertest.SuperTest<supertest.Test>,
  credentials: LoginRequest,
): Promise<string> {
  const response = await request.post('/security/login').send(credentials);
  return response.headers['set-cookie'];
}
