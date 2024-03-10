// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  // @ts-ignore
  [process.env['NODE_ENV']]: {
    username: process.env['POSTGRES_USER'],
    password: process.env['POSTGRES_PASSWORD'],
    database: process.env['POSTGRES_DB_NAME'],
    host: process.env['POSTGRES_HOST'],
    port: process.env['POSTGRES_PORT'],
    dialect: 'postgres',
  },
};
