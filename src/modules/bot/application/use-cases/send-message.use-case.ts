import { BaseUseCase } from '@/shared/common/base-use-case';
import { SendMessageDto } from '../dtos/send-msg.dto';
import {
  DocumentRepository,
  EmbeddingPort,
  VectorSearchPort,
} from '../../domain';
import { Document as DocumentEntity } from '@/modules/bot/domain';
import { LLMPort } from '../../domain/ports/llm.port';
import { DetectIntentUseCase } from './detect-intent.use-case';
import { ExecuteSqlChatUseCase } from './execute-sql-chat.use-case';

export class SendMessageUseCase implements BaseUseCase<SendMessageDto, any> {
  constructor(
    private readonly detectIntentUseCase: DetectIntentUseCase,
    private readonly executeSqlChatUseCase: ExecuteSqlChatUseCase,
    private readonly llmPort: LLMPort,
  ) {}

  async execute(input: SendMessageDto): Promise<any> {
    const type: string = await this.detectIntentUseCase.execute(input);

    switch (type) {
      case 'sql':
        return this.executeSqlChatUseCase.execute(input);
      case 'rag':
        return 'rag';
      case 'chat':
        return this.llmPort.chat(`      
        You are an AI assistant created by Dinh Manh Developer.
        Your name is Weird.

        We refuse to answer any questions related to image creation.
        Answer the question using the context below.
        Question:
        ${input.question}
        `);
    }
  }
}
