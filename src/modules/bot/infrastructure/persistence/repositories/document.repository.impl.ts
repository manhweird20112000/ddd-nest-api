import { InjectRepository } from '@nestjs/typeorm';
import { DocumentOrmEntity } from '../entities/document-orm.entity';
import { Repository } from 'typeorm';
import {
  DocumentRepository,
  Document as DocumentEntity,
} from '@/modules/bot/domain';
import { DocumentOrmMapper } from '../mappers/document-orm.mapper';

export class DocumentRepositoryImpl implements DocumentRepository {
  constructor(
    @InjectRepository(DocumentOrmEntity)
    private readonly documentRepository: Repository<DocumentOrmEntity>,
  ) {}

  async create(document: DocumentEntity): Promise<DocumentEntity> {
    const orm = DocumentOrmMapper.toOrm(document);
    await this.documentRepository.save(orm);
    return DocumentOrmMapper.toDomain(orm);
  }

  async search(embedding: number[]): Promise<string[]> {
    const vectorString = `[${embedding.join(',')}]`;
    console.log(vectorString);
    const documents = await this.documentRepository.query(
      `
        SELECT id, content
        FROM documents
        ORDER BY embedding <-> $1::vector
        LIMIT 3
        `,
      [vectorString],
    );

    return documents as any;
  }
}
