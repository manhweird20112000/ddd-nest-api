import OpenAI from 'openai';
import { LLMPort } from '../../domain/ports/llm.port';

export class OpenAILLMAdapter implements LLMPort {
  private readonly instance: OpenAI;

  constructor(apiKey: string) {
    this.instance = new OpenAI({
      apiKey,
    });
  }

  async chat(prompt: string): Promise<string> {
       const res = await this.instance.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return res.choices[0].message.content;
  }
}
