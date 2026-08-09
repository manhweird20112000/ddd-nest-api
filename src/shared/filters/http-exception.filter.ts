import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

@Catch()
export class HttpExceptionFilter
  extends BaseRpcExceptionFilter
  implements ExceptionFilter
{
  catch(exception: unknown, host: ArgumentsHost): unknown {
    if (host.getType() === 'rpc') {
      if (exception instanceof RpcException) {
        return super.catch(exception, host);
      }
      if (exception instanceof HttpException) {
        return super.catch(new RpcException(exception.getResponse()), host);
      }
      const message =
        exception instanceof Error ? exception.message : 'Internal server error';
      return super.catch(
        new RpcException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message,
        }),
        host,
      );
    }
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof Error ? exception.message : 'Internal server error';
    const errors =
      exception instanceof HttpException &&
      status === HttpStatus.BAD_REQUEST &&
      typeof exception.getResponse() === 'object'
        ? ((exception.getResponse() as { data?: unknown }).data ?? null)
        : null;
    return response.status(status).json({
      status_code: status,
      message,
      data: errors,
    });
  }
}
