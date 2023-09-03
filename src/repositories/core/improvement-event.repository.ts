import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {ImprovemnetEventRelations} from '@models/core';
import {DataSourceBindings} from '@datasources/keys';
import {ImprovemnetEvent} from '@models/core';

export class ImprovemnetEventRepository extends DefaultCrudRepository<
  ImprovemnetEvent,
  typeof ImprovemnetEvent.prototype.id,
  ImprovemnetEventRelations
> {
  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
  ) {
    super(ImprovemnetEvent, dataSource);
  }
}
