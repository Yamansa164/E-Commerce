import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MyLoggerService } from './my-logger/my-logger.service';

import {
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/client';
import { Prisma } from '@prisma/client';
import { fail } from 'src/common/base-response';

export interface MyResponseObj {
  statusCode: number;

  response: string | object;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObj: MyResponseObj = {
      statusCode: 500,
        response: 'internal server error',
    };

    if (exception instanceof HttpException) {
      myResponseObj.statusCode = exception.getStatus();
      myResponseObj.response = exception.getResponse();
    }

    if (exception instanceof PrismaClientValidationError) {
      myResponseObj.statusCode = 422;
      myResponseObj.response = exception.message.replaceAll(/\n/g, '');
    }
    if (exception instanceof BadRequestException) {
      myResponseObj.statusCode = exception.getStatus();
      myResponseObj.response = exception.getResponse();
    }

    if (exception instanceof UnauthorizedException) {
      myResponseObj.statusCode = exception.getStatus();
      myResponseObj.response = exception.getResponse();
    }

    if (exception instanceof PrismaClientUnknownRequestError) {
      myResponseObj.statusCode = 400;
      myResponseObj.response = exception.message;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        myResponseObj.statusCode = 409;
        myResponseObj.response = `email duplicate value `;
      } else {
        myResponseObj.statusCode = 400;
        myResponseObj.response = exception.message;
      }
    }

    const message =
      typeof myResponseObj.response === 'string'
        ? myResponseObj.response
        : // Nest often returns { message: string | string[], error: string, statusCode: number }
          (myResponseObj.response as any)?.message ?? myResponseObj.response;

    response
      .status(myResponseObj.statusCode)
      .json(
        fail({
          message: Array.isArray(message) ? message.join(', ') : String(message),
          data: null,
          meta: null,
        }),
      );

    this.logger.error(myResponseObj);

  }
}
