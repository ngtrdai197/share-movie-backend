import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  synchronize: false,
  migrationsTableName: 'migrations',
  entities: [__dirname + '/src/db/entities/**/*{.ts,.js}'],
  migrations: [__dirname + '/src/db/migrations/**/*{.ts,.js}'],
});
