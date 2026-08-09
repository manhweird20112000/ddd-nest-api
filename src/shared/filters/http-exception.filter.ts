import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.message
        : exception.message || 'Internal server error';
    let data = null;
    console.log(exception);
    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();

      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object' && responseBody !== null) {
        const body = responseBody as Record<string, unknown>;
        const bodyMessage = body.message;

        if (Array.isArray(bodyMessage)) {
          message = bodyMessage.join(', ');
        } else if (typeof bodyMessage === 'string') {
          message = bodyMessage;
        } else if (typeof body.error === 'string') {
          message = body.error;
        } else {
          message = exception.message;
        }

        data =
          (body.data as unknown) ??
          (body.errors as unknown) ??
          (body.error as unknown) ??
          null;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResp = {
      status_code: status,
      message,
      data,
    };

    return response.status(status).json(errorResp);
  }
}
