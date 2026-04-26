import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';

/**
 * Converts number[] to pgvector format "[1,2,3]" for PostgreSQL.
 * Prevents "invalid input syntax for type vector" error when array is serialized as JSON object.
 */
const vectorTransformer: ValueTransformer = {
  to: (value: number[]): string => `[${value.join(',')}]`,
  from: (value: string | number[]): number[] =>
    typeof value === 'string' ? (JSON.parse(value) as number[]) : value,
};

@Entity('documents')
export class DocumentOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'vector',
    length: 1536,
    transformer: vectorTransformer,
  })
  embedding: number[];
}
