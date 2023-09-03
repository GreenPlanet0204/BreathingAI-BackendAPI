import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {VitalSigns, VitalSignsRelations} from '@models/core';
import {DataSourceBindings} from '@datasources/keys';

export class VitalSignsRepository extends DefaultCrudRepository<
  VitalSigns,
  typeof VitalSigns.prototype.id,
  VitalSignsRelations
> {
  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
  ) {
    super(VitalSigns, dataSource);
  }
}
