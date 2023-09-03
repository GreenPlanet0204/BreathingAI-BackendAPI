import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {
  ImprovemnetEvent,
  UserImprovements,
  UserImprovementsRelations,
} from '@models/core';
import {DataSourceBindings} from '@datasources/keys';
import {ImprovemnetEventRepository} from './improvement-event.repository';

export class UserImprovementsRepository extends DefaultCrudRepository<
  UserImprovements,
  typeof UserImprovements.prototype.id,
  UserImprovementsRelations
> {
  public readonly improvementEvents: HasManyRepositoryFactory<
    ImprovemnetEvent,
    typeof UserImprovements.prototype.id
  >;

  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
    @repository.getter('ImprovementEvents')
    protected userImprovementEventsGetter: Getter<ImprovemnetEventRepository>,
  ) {
    super(UserImprovements, dataSource);

    // improvements
    this.improvementEvents = this.createHasManyRepositoryFactoryFor(
      'improvementEvents',
      userImprovementEventsGetter,
    );
    this.registerInclusionResolver(
      'improvementEvents',
      this.improvementEvents.inclusionResolver,
    );
  }
}
