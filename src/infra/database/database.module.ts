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
      useFactory: ({ MYSQL_URI }: IAdapterSecret) => {
        return {
          type: 'mysql',
          url: MYSQL_URI,
          timeout: 5000,
          connectionTimeout: 5000,
          autoLoadEntities: true,
          synchronize: true,
          migrationsTableName: 'migration_collection',
          extra: {
            charset: 'utf8mb4_unicode_ci',
          },
          timezone: '+07:00',
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
