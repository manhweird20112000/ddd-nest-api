import {
  BadRequestException,
  HttpStatus,
  Injectable,
  ValidationError,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';
import { Format } from '@/shared/utils/format';

@Injectable()
export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException({
          message: 'Validation failed',
          data: Format.formatErrorsValidate(errors),
        });
      },
    });
  }
}
