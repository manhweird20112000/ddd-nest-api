import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IAdapterSecret } from '@/infra/secret/adapter';
import { SecretModule } from '@/infra/secret';
import { MATH_SERVICE } from './math.constants';
import { MathController } from './math.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MATH_SERVICE,
        imports: [SecretModule],
        inject: [IAdapterSecret],
        useFactory: (secret: IAdapterSecret) => ({
          transport: Transport.TCP,
          options: {
            host: secret.MATH_SERVICE_HOST,
            port: secret.MATH_SERVICE_PORT,
          },
        }),
      },
    ]),
  ],
  controllers: [MathController],
})
export class MathModule {}
