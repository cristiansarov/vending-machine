import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import ProductModel from '../../product/models/product.model';
import UserSessionModel from '../../security/models/userSession.model';
import { UserRoles } from '../../../global/universal.types';


@Table({ tableName: 'users', timestamps: false })
export default class UserModel extends Model {
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  username: string;

  @Column({ type: DataType.STRING, allowNull: false })
  passwordHash: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  deposit: number;

  @Column({ type: DataType.ENUM(...Object.values(UserRoles)), defaultValue: UserRoles.buyer })
  role: UserRoles;

  /*
   Associations
  */
  @HasMany(() => ProductModel)
  products: ProductModel[];

  @HasMany(() => UserSessionModel)
  sessions: UserSessionModel[];
}
