import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SecretModule } from '@/infra/secret';
import { IAdapterSecret } from '@/infra/secret/adapter';
import { createMikroOrmConfig } from '@/infra/config/database.config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: (secrets: IAdapterSecret) => createMikroOrmConfig(secrets),
      imports: [SecretModule],
      inject: [IAdapterSecret],
    }),
  ],
})
export class DatabaseModule {}
