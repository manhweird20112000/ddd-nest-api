import { SecretModule } from '@/infra/secret';
import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EmbeddingPort } from './domain/ports/embedding.port';
import { OpenAIEmbeddingAdapter } from './infrastructure/embedding/openai-embedding.adapter';
import { IAdapterSecret } from '@/infra/secret/adapter';
import { BotController } from './interface/controllers/bot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentOrmEntity } from './infrastructure/persistence/entities/document-orm.entity';
import { DocumentRepository, VectorSearchPort } from './domain';
import { DocumentRepositoryImpl } from './infrastructure/persistence/repositories/document.repository.impl';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { PostgresVectorAdapter } from './infrastructure/vector/postgress-vector.adapter';
import { LLMPort } from './domain/ports/llm.port';
import { OpenAILLMAdapter } from './infrastructure/llm/openai-llm.adapter';
import { DetectIntentUseCase } from './application/use-cases/detect-intent.use-case';
import { ExecuteSqlChatUseCase } from './application/use-cases/execute-sql-chat.use-case';

@Module({
  imports: [SecretModule, TypeOrmModule.forFeature([DocumentOrmEntity])],
  providers: [
    {
      provide: EmbeddingPort,
      inject: [IAdapterSecret],
      useFactory: ({ OPENAI_API_KEY }: IAdapterSecret) => {
        return new OpenAIEmbeddingAdapter(OPENAI_API_KEY);
      },
    },
    {
      provide: DocumentRepository,
      useClass: DocumentRepositoryImpl,
    },
    {
      provide: LLMPort,
      inject: [IAdapterSecret],
      useFactory: ({ OPENAI_API_KEY }: IAdapterSecret) => {
        return new OpenAILLMAdapter(OPENAI_API_KEY);
      },
    },
    {
      provide: VectorSearchPort,
      useFactory: (documentRepository: DocumentRepository) => {
        return new PostgresVectorAdapter(documentRepository);
      },
      inject: [DocumentRepository],
    },
    {
      provide: DetectIntentUseCase,
      inject: [LLMPort],
      useFactory: (llmPort: LLMPort) => {
        return new DetectIntentUseCase(llmPort);
      },
    },
    {
      provide: ExecuteSqlChatUseCase,
      inject: [LLMPort, DataSource],
      useFactory: (llmPort: LLMPort, dataSource: DataSource) => {
        return new ExecuteSqlChatUseCase(llmPort, dataSource);
      },
    },
    {
      provide: SendMessageUseCase,
      inject: [DetectIntentUseCase, ExecuteSqlChatUseCase, LLMPort],
      useFactory: (
        detectIntentUseCase: DetectIntentUseCase,
        executeSqlChatUseCase: ExecuteSqlChatUseCase,
        llmPort: LLMPort,
      ) => {
        return new SendMessageUseCase(
          detectIntentUseCase,
          executeSqlChatUseCase,
          llmPort,
        );
      },
    },
  ],
  exports: [],
  controllers: [BotController],
})
export class BotModule {}
