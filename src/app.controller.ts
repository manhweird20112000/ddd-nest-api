import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getMsg(): string {
    return 'user-service';
  }

  @Get('health')
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
