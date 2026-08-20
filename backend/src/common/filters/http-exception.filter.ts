import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

function hasMessageArray(value: object): value is { message: string[] } {
  return 'message' in value && Array.isArray((value as { message: unknown }).message);
}

/**
 * Normaliza todas as respostas de erro da API num formato único.
 * `errors` cobre o retorno do ValidationPipe (array de strings do class-validator).
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Erro interno do servidor';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      errors:
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        hasMessageArray(exceptionResponse)
          ? exceptionResponse.message
          : undefined,
    });
  }
}
