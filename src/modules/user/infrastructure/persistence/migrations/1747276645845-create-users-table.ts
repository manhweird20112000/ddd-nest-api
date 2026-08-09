import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1747276645845 implements MigrationInterface {
  name = 'CreateUsersTable1747276645845';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL,
        "auth_user_id" character varying(128) NOT NULL,
        "email" character varying(255) NOT NULL,
        "display_name" character varying(120),
        "avatar_url" character varying(2048),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_auth_user_id" UNIQUE ("auth_user_id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
