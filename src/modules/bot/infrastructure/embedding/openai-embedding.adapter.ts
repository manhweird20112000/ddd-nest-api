import OpenAI from 'openai';
import { EmbeddingPort } from '../../domain/ports/embedding.port';

export class OpenAIEmbeddingAdapter implements EmbeddingPort {
  private readonly instance: OpenAI;

  constructor(apiKey: string) {
    this.instance = new OpenAI({
      apiKey,
    });
  }

  async embed(text: string): Promise<number[]> {
    const response = await this.instance.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  }
}
