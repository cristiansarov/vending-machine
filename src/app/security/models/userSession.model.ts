import {
  Table,
  Column,
  ForeignKey,
  Model,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import UserModel from '../../user/models/user.model';

@Table({ tableName: 'userSessions', timestamps: false })
export default class UserSessionModel extends Model {
  id: number;

  @Column({ allowNull: false })
  token: string;

  /*
   Associations
  */
  @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE' })
  @ForeignKey(() => UserModel)
  userId: UserModel['id'];

  @BelongsTo(() => UserModel)
  user: UserModel;
}
