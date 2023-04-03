export default () => ({
  api_port: process.env.PUBLIC_API_PORT,
  db: {
    is_logging: process.env.DB_LOGGING ? +process.env.DB_LOGGING : 0,
    master: {
      host: process.env.MARIADB_HOST,
      port: process.env.MARIADB_PORT,
      username: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
      database: process.env.MARIADB_DATABASE,
    },
    slave: {
      host: process.env.MARIADB_HOST,
      port: process.env.MARIADB_PORT,
      username: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
      database: process.env.MARIADB_DATABASE,
    },
  },
});
