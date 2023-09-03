import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';

import {
  DeviceAuthentication,
  UserDevices,
  UserDevicesRelations,
} from '@models/core';
import {DeviceAuthenticationRepository} from './device-authentication.repository';
import {DataSourceBindings} from '@datasources/keys';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';

export class UserDevicesRepository extends DefaultCrudRepository<
  UserDevices,
  typeof UserDevices.prototype.id,
  UserDevicesRelations
> {
  public readonly auth: HasOneRepositoryFactory<
    DeviceAuthentication,
    typeof UserDevices.prototype.id
  >;
  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,

    @repository.getter('DeviceAuthenticationRepository')
    protected deviceAuthenticationGetter: Getter<DeviceAuthenticationRepository>,
  ) {
    super(UserDevices, dataSource);

    this.auth = this.createHasOneRepositoryFactoryFor(
      'auth',
      deviceAuthenticationGetter,
    );

    this.registerInclusionResolver('auth', this.auth.inclusionResolver);
  }
}
