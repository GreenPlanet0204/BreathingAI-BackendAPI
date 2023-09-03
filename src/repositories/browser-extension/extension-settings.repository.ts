import {DataSourceBindings} from '@datasources/keys';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';

import {
  ExtensionSettings,
  ExtensionSettingsRelations,
} from '@models/browser-extension';
import {User} from '@models/core';
import {UserRepository} from '@repositories/core';

export class ExtensionSettingsRepository extends DefaultCrudRepository<
  ExtensionSettings,
  typeof ExtensionSettings.prototype.id,
  ExtensionSettingsRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof ExtensionSettings.prototype.id
  >;

  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
    @repository.getter('UserRepository')
    userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(ExtensionSettings, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
  }
}
