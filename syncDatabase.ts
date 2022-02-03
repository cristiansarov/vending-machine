import * as ST from 'sequelize-typescript';
import { config } from 'node-config-ts';
import * as path from 'path';
import { Options } from 'sequelize';


const sequelize = new ST.Sequelize(config.database as Options);

sequelize.addModels([path.join(`${__dirname}/src/**/*.model.{ts,js}`)]);
sequelize.sync({ force: true }).then(() => {
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
