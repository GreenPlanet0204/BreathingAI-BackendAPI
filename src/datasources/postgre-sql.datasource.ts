import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
  name: 'postgreSQL',
  connector: 'postgresql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: process.env.DB_SCHEMA,
};

@lifeCycleObserver('datasource')
export class PostgreSqlDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'postgreSQL';
  static readonly defaultConfig = dbConfig;

  constructor(
    @inject('datasources.config.postgreSQL', {optional: true})
    dsConfig: object = dbConfig,
  ) {
    super(dsConfig);
  }
}
