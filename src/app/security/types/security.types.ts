import { IsEnum, IsNumber, IsString } from 'class-validator';
import UserModel from '../../user/models/user.model';
import { UserRoles } from '../../user/types/user.types';

export type JwtTokenPayload = {
  userId: UserModel['id'];
};

export class CurrentUser {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsNumber()
  deposit: number;

  @IsEnum(UserRoles)
  role: UserRoles;

  constructor(props: CurrentUser) {
    Object.assign(this, props);
  }

  static fromRepository(props: UserModel) {
    return new CurrentUser({
      id: props.id,
      username: props.username,
      deposit: props.deposit,
      role: props.role,
    })
  }
}
