import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import UserModel from '../../user/models/user.model';

@Table({ tableName: 'products', timestamps: false })
export default class ProductModel extends Model {
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  productName: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  cost: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  amountAvailable: number;

  /*
    Associations
   */
  @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE' })
  @ForeignKey(() => UserModel)
  sellerId: UserModel['id'];

  @BelongsTo(() => UserModel)
  seller: UserModel;
}
