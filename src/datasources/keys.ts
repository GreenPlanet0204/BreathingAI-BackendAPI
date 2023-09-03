import {BindingKey} from '@loopback/core';
import {DataSource} from '@loopback/repository';

export namespace DataSourceBindings {
  export const DATASOURCE_PSQL = BindingKey.create<DataSource>(
    'datasources.postgreSQL',
  );
}
