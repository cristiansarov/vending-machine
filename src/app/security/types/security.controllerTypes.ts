import { IsNotEmpty, IsString } from 'class-validator';
import { ULoginRequest, ULoginResponse } from '../../../global/universal.types';

export class LoginRequest implements ULoginRequest {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponse implements ULoginResponse {
  activeSessions: number;
}
