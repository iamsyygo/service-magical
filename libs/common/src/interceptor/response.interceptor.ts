import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class AppResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const status = response.statusCode || HttpStatus.OK;

        response.status(status).json({
          code: status,
          bizdata: data,
          message: 'success',
          timestamp: +Date.now(),
          uri: request.url,
          succeed: true,
        });
      }),
    );
  }
}
