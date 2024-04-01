import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCreatedAtToTimestamp1711940999669 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Alter the data type of created_at column to TIMESTAMP
        await queryRunner.query(`ALTER TABLE "keyword" ALTER COLUMN "created_at" TYPE TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the data type of created_at column back to DATE
        await queryRunner.query(`ALTER TABLE "keyword" ALTER COLUMN "created_at" TYPE DATE`);
    }
}
