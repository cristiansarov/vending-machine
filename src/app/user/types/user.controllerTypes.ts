import UserModel from '../models/user.model';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { UserRoles } from './user.types';

export class UserRegistrationDetails {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserDetails {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password?: string;

  constructor(props: UserDetails) {
    Object.assign(this, props);
  }

  static fromRepository(props: UserModel) {
    return new UserDetails({
      username: props.username,
    })
  }
}

export class UserListItem {
  id: number;
  username: string;
  role: UserRoles;

  constructor(props: UserListItem) {
    Object.assign(this, props);
  }

  static fromRepository(props: UserModel) {
    return new UserListItem({
      id: props.id,
      username: props.username,
      role: props.role,
    })
  }
}
