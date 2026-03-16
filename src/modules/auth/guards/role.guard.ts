import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLE_KEY } from '../decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required role from metadata
    const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true; // no role restriction
    }

    const user = context.switchToHttp().getRequest().user;
    if (!user) {
      return false;
    }

    // Check if user has the required role
    return requiredRole.some((role) => user?.role === role);
  }
}
