import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeNameColumn1747276645845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'price',
        type: 'decimal',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'price');
  }
}
