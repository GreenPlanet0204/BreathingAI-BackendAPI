import {DataSourceBindings} from '@datasources/keys';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';

import {
  UserScreenTime,
  UserScreenTimeRelations,
} from '@models/browser-extension/user-screentime.model';
import {User} from '@models/core';
import {UserRepository} from '@repositories/core';

export class UserScreenTimeRepository extends DefaultCrudRepository<
  UserScreenTime,
  typeof UserScreenTime.prototype.id,
  UserScreenTimeRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof UserScreenTime.prototype.id
  >;

  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
    @repository.getter('UserRepository')
    userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserScreenTime, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
  }
}
