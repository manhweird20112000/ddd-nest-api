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
      useFactory: ({ POSTGRES_URI, POSTGRES_SYNC }: IAdapterSecret) => ({
        type: 'postgres' as const,
        url: POSTGRES_URI,
        timeout: 5000,
        connectionTimeout: 5000,
        autoLoadEntities: true,
        synchronize: POSTGRES_SYNC,
        migrationsTableName: 'migration_collection',
        timezone: '+07:00',
        logging: true,
        logger: 'advanced-console' as const,
        migrations: [
          'dist/modules/**/infrastructure/persistence/migrations/**/*{.ts,.js}',
        ],
        entities: [
          'dist/modules/**/infrastructure/persistence/entities/**/*.entity{.ts,.js}',
        ],
      }),
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
