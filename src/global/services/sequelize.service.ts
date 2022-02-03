import { Options } from 'sequelize';
import * as ST from 'sequelize-typescript';
import { config } from 'node-config-ts';
import * as path from 'path';


export default function sequelizeFactory() {
  const sequelize = new ST.Sequelize(config.database as Options);

  sequelize.addModels([path.join(__dirname, '../../**/*.model.{ts,js}')]);

  return sequelize;
}
