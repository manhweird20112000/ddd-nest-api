import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import {
  addTransactionalDataSource,
  getDataSourceByName,
} from 'typeorm-transactional';
import { SecretModule } from '@/infra/secret';
import { IAdapterSecret } from '@/infra/secret/adapter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: ({ POSTGRES_URI }: IAdapterSecret) => {
        return {
          type: 'postgres',
          url: POSTGRES_URI,
          timeout: 5000,
          connectionTimeout: 5000,
          autoLoadEntities: true,
          synchronize: true,
          migrationsTableName: 'migration_collection',
          extra: {
            charset: 'utf8mb4_unicode_ci',
          },
          timezone: '+07:00',
          // debug: true,
          logging: true,
          logger: 'advanced-console',
          migrations: [
            'dist/modules/**/infrastructure/persistence/migrations/**/*{.ts,.js}',
          ],
          entities: [
            'dist/modules/**/infrastructure/persistence/entities/**/*.entity{.ts,.js}',
          ],
        };
      },
      async dataSourceFactory(options: DataSourceOptions) {
        return (
          getDataSourceByName('default') ||
          addTransactionalDataSource(new DataSource(options))
        );
      },
      imports: [SecretModule],
      inject: [IAdapterSecret],
    }),
  ],
})
export class DatabaseModule {}
