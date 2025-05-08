import knex from 'knex';
import config from '../config/knexfile';

const environment = process.env.NODE_ENV || 'development';
const connectionConfig = config[environment];

console.log(
  'Database Configuration:',
  JSON.stringify(connectionConfig, null, 2)
);

export const db = knex(connectionConfig);

export default db;
