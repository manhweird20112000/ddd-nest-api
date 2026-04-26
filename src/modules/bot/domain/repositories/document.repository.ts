import { Document } from '../entities/document.entity';

export abstract class DocumentRepository {
    abstract search(embedding: number[]): Promise<string[]>;
    abstract create(document: Document): Promise<Document>;
}
