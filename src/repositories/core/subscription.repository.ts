import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {Subscription, SubscriptionRelations} from '@models/core';
import {DataSourceBindings} from '@datasources/keys';

export class SubscriptionRepository extends DefaultCrudRepository<
  Subscription,
  typeof Subscription.prototype.id,
  SubscriptionRelations
> {
  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
  ) {
    super(Subscription, dataSource);
  }
}
