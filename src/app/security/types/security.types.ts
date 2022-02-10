import UserModel from '../../user/models/user.model';
import { UCurrentUser, UserRoles } from '../../../global/universal.types';

export type JwtTokenPayload = {
  userId: UserModel['id'];
};

export class CurrentUser implements UCurrentUser {
  id: number;
  username: string;
  deposit: number;
  role: UserRoles;
  activeSessions: number;

  constructor(props: CurrentUser) {
    Object.assign(this, props);
  }

  static fromRepository(props: UserModel, activeSessions: number) {
    return new CurrentUser({
      id: props.id,
      username: props.username,
      deposit: props.deposit,
      role: props.role,
      activeSessions,
    });
  }
}
