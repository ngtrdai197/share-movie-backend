import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMovieSchema1680277456754 implements MigrationInterface {
  name = 'AddMovieSchema1680277456754';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`movie\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`videoUrl\` text NOT NULL, \`sharedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movie\` ADD CONSTRAINT \`FK_f924ef3da04dd6c8787347c27f7\` FOREIGN KEY (\`sharedById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`movie\` DROP FOREIGN KEY \`FK_f924ef3da04dd6c8787347c27f7\``,
    );
    await queryRunner.query(`DROP TABLE \`movie\``);
  }
}
