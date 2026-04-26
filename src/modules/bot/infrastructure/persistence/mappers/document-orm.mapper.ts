import { DocumentOrmEntity } from '../entities/document-orm.entity';
import { Document } from '@/modules/bot/domain';

export class DocumentOrmMapper {
  static toOrm(document: Document): DocumentOrmEntity {
    const orm = new DocumentOrmEntity();
    orm.id = document.id;
    orm.title = document.title;
    orm.content = document.content;
    orm.embedding = document.embedding;
    return orm;
  }

  static toDomain(orm: DocumentOrmEntity): Document {
    return new Document({
      id: orm.id,
      title: orm.title,
      content: orm.content,
      embedding: orm.embedding,
    });
  }
}
