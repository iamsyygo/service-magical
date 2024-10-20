import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { Request } from 'express';

/**
 * Custom exception filter
 * @description Catch all exceptions and do something
 * @see https://docs.nestjs.com/exception-filters
 */
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const status = exception.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const result = {
      timestamp: +new Date(),
      code: status,
      uri: request.url,
      error: exception.message || 'Unknown Error',
    };
    if (exception instanceof HttpException) {
      const response = exception.getResponse?.();

      result.error = response?.['error'] || exception.message;
      // @ts-expect-error
      result.message = response?.message;
    } else {
      result.error = 'Internal server error';
      // result.message = exception.toString();
    }
    response.status(status).json(result);
  }
}
