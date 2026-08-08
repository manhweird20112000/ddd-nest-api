import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { MATH_SERVICE } from './math.constants';

@Controller({ path: 'math', version: '1' })
export class MathController {
  constructor(@Inject(MATH_SERVICE) private readonly client: ClientProxy) {}

  @Post('sum')
  sum(@Body() data: number[]): Observable<number> {
    return this.client.send<number>({ cmd: 'sum' }, data ?? []);
  }
}
