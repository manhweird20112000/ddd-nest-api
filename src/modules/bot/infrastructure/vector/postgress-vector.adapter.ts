import { Pool } from 'pg';
import { VectorSearchPort } from '../../domain/ports/vector-search.port';
import { DocumentRepository } from '../../domain';

export class PostgresVectorAdapter implements VectorSearchPort {
  constructor(
    private readonly documentRepository: DocumentRepository,
  ) {}
  search(embedding: number[]): Promise<string[]> {
    return this.documentRepository.search(embedding);
  }
}
