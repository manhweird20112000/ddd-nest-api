export abstract class VectorSearchPort {
    abstract search(embedding: number[]): Promise<string[]>;
}