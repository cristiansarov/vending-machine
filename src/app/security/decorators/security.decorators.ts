import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { UserRoles } from '../../../global/universal.types';

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
