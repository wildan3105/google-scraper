import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1711782366740 implements MigrationInterface {
    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`CREATE TABLE "user" (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email VARCHAR(255) NOT NULL,
            password TEXT NOT NULL,
            is_active BOOLEAN DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT now(),
            last_login TIMESTAMP
        )`);

        await queryRunner.query(`CREATE UNIQUE INDEX idx_unique_email ON "user" (email) WHERE is_active = true`);
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`DROP INDEX idx_unique_email`);

        await queryRunner.query(`DROP TABLE "user"`);
    }
}
