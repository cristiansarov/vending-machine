import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private oneOfRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const oneOfRoles = this.oneOfRoles;
    if (!oneOfRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<Request>();
    if (oneOfRoles && !oneOfRoles.includes(user.role)) {
      throw new ForbiddenException('The user does not have the necessary role');
    }

    return true;
  }
}
