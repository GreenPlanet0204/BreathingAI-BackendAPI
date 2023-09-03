import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {UserToken, UserTokenRelations} from '@models/core';
import {DataSourceBindings} from '@datasources/keys';

export class UserTokenRepository extends DefaultCrudRepository<
  UserToken,
  typeof UserToken.prototype.token,
  UserTokenRelations
> {
  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
  ) {
    super(UserToken, dataSource);
  }
}
