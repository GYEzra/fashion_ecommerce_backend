import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../auth.decorator';
import { CUSTOM_MESSAGES } from 'src/common/enums/custom-messages.enum';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    if (err || !user) {
      throw err || new UnauthorizedException('Token không hợp lệ');
    }

    const targetMethod = request.method;
    const targetEndpoint = request.route?.path as string;

    const permissions = user.permissions ?? [];

    const isExistPermission = permissions.find(
      permission => permission.apiPath === targetEndpoint && permission.method === targetMethod,
    );

    if (!isExistPermission) throw new ForbiddenException(CUSTOM_MESSAGES.FORBIDDEN);

    return user;
  }
}
