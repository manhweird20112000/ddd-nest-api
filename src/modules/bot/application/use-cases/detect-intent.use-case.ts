import { BaseUseCase } from '@/shared/common/base-use-case';
import { LLMPort } from '../../domain/ports/llm.port';

interface Input {
  question: string;
}

export class DetectIntentUseCase implements BaseUseCase<Input, string> {
  constructor(private readonly llmPort: LLMPort) {}

  async execute(input: Input): Promise<string> {
    const prompt = `
        Classify the user question into one of these categories:

        sql -> question about database data
        rag -> question about documents or policies
        chat -> normal conversation

        Return only one word: sql, rag, or chat.

        Question:
        ${input.question}
        `;

    return this.llmPort.chat(prompt);
  }
}
