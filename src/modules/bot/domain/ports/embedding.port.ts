export abstract class EmbeddingPort {
    abstract embed(text: string): Promise<number[]>;
}