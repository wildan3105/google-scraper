import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateKeywordTable1711925608107 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "keyword" (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            value TEXT NOT NULL,
            created_at DATE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP default now(),
            user_id UUID NOT NULL,
            num_of_links INT,
            num_of_adwords INT,
            search_result_information TEXT,
            html_code TEXT,
            FOREIGN KEY (user_id) REFERENCES "user"(id)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "keyword"`);
    }
}
