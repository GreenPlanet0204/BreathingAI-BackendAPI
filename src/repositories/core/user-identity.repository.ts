import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {UserIdentity, UserIdentityRelations} from '@models/core';
import {DataSourceBindings} from '@datasources/keys';

export class UserIdentityRepository extends DefaultCrudRepository<
  UserIdentity,
  typeof UserIdentity.prototype.id,
  UserIdentityRelations
> {
  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
  ) {
    super(UserIdentity, dataSource);
  }
}
