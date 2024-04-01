import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexOnUserId1711926830090 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX idx_user_id ON "keyword" ("user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX idx_user_id`);
    }
}
