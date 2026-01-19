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
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { Prisma } from '@prisma/client';

export interface MyResponseObj {
  statusCode: number;
  timestamp: string;
  path: string;
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
      timestamp: new Date().toISOString(),
      path: request.url,
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

    response.status(myResponseObj.statusCode).json(myResponseObj);

    this.logger.error(myResponseObj);

  }
}
