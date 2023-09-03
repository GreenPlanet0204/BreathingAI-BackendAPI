import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  ReferencesManyAccessor,
  repository,
} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {
  UserColors,
  Subscription,
  User,
  UserCredentials,
  UserDevices,
  UserIdentity,
  UserImprovements,
  UserRelations,
  UserVitals,
} from '@models/core';
import {UserCredentialsRepository} from './user-credentials.repository';
import {UserIdentityRepository} from './user-identity.repository';
import {UserVitalsRepository} from './user-vitals.repository';
import {UserDevicesRepository} from './user-devices.repository';
import {DataSourceBindings} from '@datasources/keys';
import {ExtensionSettings} from '@models/browser-extension';
import {ExtensionSettingsRepository} from '../browser-extension';
import {UserImprovementsRepository} from './user-improvements.repository';
import {UserColorRepository} from './user-color.repository';
import {UserScreenTimeRepository} from '@repositories/browser-extension/user-screentime.repository';
import {UserScreenTime} from '@models/browser-extension/user-screentime.model';
export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly profiles: HasManyRepositoryFactory<
    UserIdentity,
    typeof User.prototype.id
  >;

  public readonly credentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  public readonly vitals: HasOneRepositoryFactory<
    UserVitals,
    typeof User.prototype.id
  >;

  public readonly subscription: HasOneRepositoryFactory<
    Subscription,
    typeof User.prototype.id
  >;

  public readonly extensionSettings: HasOneRepositoryFactory<
    ExtensionSettings,
    typeof User.prototype.id
  >;

  public readonly devices: ReferencesManyAccessor<
    UserDevices,
    typeof User.prototype.id
  >;

  public readonly improvements: HasOneRepositoryFactory<
    UserImprovements,
    typeof User.prototype.id
  >;

  public readonly userColors: HasOneRepositoryFactory<
    UserColors,
    typeof User.prototype.id
  >;

  public readonly screenTime: HasManyRepositoryFactory<
    UserScreenTime,
    typeof User.prototype.id
  >;

  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,

    @repository.getter('UserIdentityRepository')
    protected profilesGetter: Getter<UserIdentityRepository>,

    @repository.getter('ExtensionSettingsRepository')
    protected extensionSettingsGetter: Getter<ExtensionSettingsRepository>,

    @repository.getter('UserCredentialsRepository')
    protected credentialsGetter: Getter<UserCredentialsRepository>,

    @repository.getter('UserVitalsRepository')
    protected userVitalsGetter: Getter<UserVitalsRepository>,

    @repository.getter('UserDevicesRepository')
    protected userDevicesGetter: Getter<UserDevicesRepository>,

    @repository.getter('UserImprovementsRepository')
    protected userImprovementsGetter: Getter<UserImprovementsRepository>,

    @repository.getter('UserColorRepository')
    protected userColorGetter: Getter<UserColorRepository>,

    @repository.getter('UserScreentimeRepository')
    protected screenTimeGetter: Getter<UserScreenTimeRepository>,
  ) {
    super(User, dataSource);

    // profiles
    this.profiles = this.createHasManyRepositoryFactoryFor(
      'profiles',
      profilesGetter,
    );
    this.registerInclusionResolver('profiles', this.profiles.inclusionResolver);

    // credentials
    this.credentials = this.createHasOneRepositoryFactoryFor(
      'credentials',
      credentialsGetter,
    );
    this.registerInclusionResolver(
      'credentials',
      this.credentials.inclusionResolver,
    );

    // extensionSettings
    this.extensionSettings = this.createHasOneRepositoryFactoryFor(
      'extensionSettings',
      extensionSettingsGetter,
    );
    this.registerInclusionResolver(
      'extensionSettings',
      this.extensionSettings.inclusionResolver,
    );

    // vitals
    this.vitals = this.createHasOneRepositoryFactoryFor(
      'vitals',
      userVitalsGetter,
    );
    this.registerInclusionResolver('vitals', this.vitals.inclusionResolver);

    // colors
    this.userColors = this.createHasOneRepositoryFactoryFor(
      'colors',
      userColorGetter,
    );
    this.registerInclusionResolver(
      'userColors',
      this.userColors.inclusionResolver,
    );

    // improvements
    this.improvements = this.createHasOneRepositoryFactoryFor(
      'improvements',
      userImprovementsGetter,
    );
    this.registerInclusionResolver(
      'improvements',
      this.improvements.inclusionResolver,
    );

    // devices
    this.devices = this.createReferencesManyAccessorFor(
      'devices',
      userDevicesGetter,
    );
    this.registerInclusionResolver('devices', this.devices.inclusionResolver);

    // screenTime
    this.screenTime = this.createHasManyRepositoryFactoryFor(
      'screenTime',
      screenTimeGetter,
    );
    this.registerInclusionResolver(
      'screenTime',
      this.devices.inclusionResolver,
    );
  }
}
