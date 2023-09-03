import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {
  DeviceAuhtenticationRelations,
  DeviceAuthentication,
} from '@models/core';
import {DataSourceBindings} from '@datasources/keys';

export class DeviceAuthenticationRepository extends DefaultCrudRepository<
  DeviceAuthentication,
  typeof DeviceAuthentication.prototype.id,
  DeviceAuhtenticationRelations
> {
  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
  ) {
    super(DeviceAuthentication, dataSource);
  }
}
