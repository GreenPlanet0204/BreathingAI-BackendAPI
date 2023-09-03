import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {UserVitals, UserVitalsRelations, VitalSigns} from '@models/core';
import {VitalSignsRepository} from './vital-signs.repository';
import {DataSourceBindings} from '@datasources/keys';

export class UserVitalsRepository extends DefaultCrudRepository<
  UserVitals,
  typeof UserVitals.prototype.id,
  UserVitalsRelations
> {
  public readonly vitalSigns: HasManyRepositoryFactory<
    VitalSigns,
    typeof UserVitals.prototype.id
  >;

  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,

    @repository.getter('VitalSignsRepository')
    protected vitalSignsGetter: Getter<VitalSignsRepository>,
  ) {
    super(UserVitals, dataSource);

    this.vitalSigns = this.createHasManyRepositoryFactoryFor(
      'vitalSigns',
      vitalSignsGetter,
    );

    this.registerInclusionResolver(
      'vitalSigns',
      this.vitalSigns.inclusionResolver,
    );
  }
}
