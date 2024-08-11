import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../interfaces/response.interface';
import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE } from '../decorators/response.decorator';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || '';

    return next.handle().pipe(
      map((data) => ({
        author: 'Code bao ghiền - Phạm Duy Khánh',
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: message,
        data: data,
      })),
    );
  }
}
