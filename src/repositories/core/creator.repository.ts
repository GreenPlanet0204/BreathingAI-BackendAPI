import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {Creator, CreatorRelations} from '@models/core';
import {DataSourceBindings} from '@datasources/keys';

export class CreatorRepository extends DefaultCrudRepository<
  Creator,
  typeof Creator.prototype.id,
  CreatorRelations
> {
  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
  ) {
    super(Creator, dataSource);
  }
}
