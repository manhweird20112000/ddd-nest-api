export abstract class LLMPort {
    abstract chat(prompt: string): Promise<string>;
}