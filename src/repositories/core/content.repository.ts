import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {Content, ContentRelations} from '@models/core';
import {DataSourceBindings} from '@datasources/keys';

export class ContentRepository extends DefaultCrudRepository<
  Content,
  typeof Content.prototype.id,
  ContentRelations
> {
  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
  ) {
    super(Content, dataSource);
  }
}
