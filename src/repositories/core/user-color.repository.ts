import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {User, UserColors, UserColorsRelations} from '@models/core';
import {DataSourceBindings} from '@datasources/keys';
import {UserRepository} from './user.repository';

export class UserColorRepository extends DefaultCrudRepository<
  UserColors,
  typeof UserColors.prototype.id,
  UserColorsRelations
> {
  public readonly user: BelongsToAccessor<User, typeof UserColors.prototype.id>;
  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
    @repository.getter('UserRepository')
    userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(UserColors, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
  }
}
