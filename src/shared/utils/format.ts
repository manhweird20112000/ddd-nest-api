import { ValidationError } from '@nestjs/common';

export class Format {
  static formatErrorsValidate(errors: ValidationError[]) {
    const params: Record<string, string> = {};

    const appendError = (error: ValidationError, parentPath: string[] = []) => {
      const fieldPath = [...parentPath, error.property];
      const path = fieldPath.join('.');

      if (error.constraints && Object.keys(error.constraints).length > 0) {
        const firstConstraint = Object.values(error.constraints)[0];
        params[path] = firstConstraint as string;
      } else if (!error.children || error.children.length === 0) {
        params[path] = 'Invalid value';
      }

      if (error.children && error.children.length > 0) {
        error.children.forEach((child) => appendError(child, fieldPath));
      }
    };

    errors.forEach((error: ValidationError) => appendError(error));
    return params;
  }
}
