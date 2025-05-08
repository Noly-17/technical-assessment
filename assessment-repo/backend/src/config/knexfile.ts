import { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'taskdb',
      user: process.env.DB_USER || 'developer',
      password: process.env.DB_PASSWORD || 'localdev',
    },
    migrations: {
      directory: path.join(__dirname, '../db/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.join(__dirname, '../db/seeds'),
    },
  },

  test: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_TEST_NAME || 'taskdb_test',
      user: process.env.DB_USER || 'developer',
      password: process.env.DB_PASSWORD || 'localdev',
    },
    migrations: {
      directory: path.join(__dirname, '../db/migrations'),
      extension: 'ts',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: path.join(__dirname, '../db/migrations'),
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default config;
