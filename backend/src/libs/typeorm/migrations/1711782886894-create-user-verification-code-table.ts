import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserVerificationCodeTable1711782886894 implements MigrationInterface {
    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(`CREATE TABLE "user_verification_code" (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            code VARCHAR(255) NOT NULL,
            created_at TIMESTAMP NOT NULL default now(),
            expired_at TIMESTAMP
        )`);
        await queryRunner.query(
            `ALTER TABLE "user_verification_code" ADD CONSTRAINT "FK_user_verification_code" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_user_verification_code"`);
        await queryRunner.query(`DROP TABLE "user_verification_code"`);
    }
}
