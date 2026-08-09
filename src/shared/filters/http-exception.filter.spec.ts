import { BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { Format } from '@/shared/utils/format';

describe('HttpExceptionFilter', () => {
  it('returns validation message and data for bad request exceptions', () => {
    const filter = new HttpExceptionFilter();
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    } as any;

    const exception = new BadRequestException({
      message: 'Validation failed',
      data: { email: 'email must be an email address' },
    });

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status_code: 400,
        message: 'Validation failed',
        data: { email: 'email must be an email address' },
      }),
    );
  });

  it('formats validation errors without throwing when constraints are missing', () => {
    const errors = [
      {
        property: 'email',
        children: [],
      },
    ] as any;

    expect(() => Format.formatErrorsValidate(errors)).not.toThrow();
    expect(Format.formatErrorsValidate(errors)).toEqual({
      email: 'Invalid value',
    });
  });
});
