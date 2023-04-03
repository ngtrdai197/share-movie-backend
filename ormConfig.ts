import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  type: 'mariadb',
  host: process.env.MARIADB_HOST,
  port: parseInt(process.env.MARIADB_PORT || '', 10),
  username: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  logging: true,
  synchronize: false,
  migrationsTableName: 'migrations',
  entities: [__dirname + '/src/db/entities/**/*{.ts,.js}'],
  migrations: [__dirname + '/src/db/migrations/**/*{.ts,.js}'],
});
