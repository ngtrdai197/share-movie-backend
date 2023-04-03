import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUserSchema1680265274962 implements MigrationInterface {
  name = 'InitUserSchema1680265274962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`hashed_password\` varchar(255) NOT NULL, \`salt\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
