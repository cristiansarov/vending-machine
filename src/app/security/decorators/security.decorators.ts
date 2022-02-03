import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoles } from '../../user/types/user.types';
import { RolesGuard } from '../guards/roles.guard';

export interface AuthenticatedProps {
  oneOfRoles?: UserRoles[];
}

export function Authenticated({ oneOfRoles }: AuthenticatedProps = {}) {
  const decorators = [];

  decorators.push(UseGuards(AuthGuard('jwt')));

  if (oneOfRoles) {
    decorators.push(UseGuards(new RolesGuard(oneOfRoles)));
  }

  return applyDecorators(...decorators);
}
