import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {Subscription, Customer, User, CustomerRelations} from '@models/core';

import {SubscriptionRepository} from './subscription.repository';
import {DataSourceBindings} from '@datasources/keys';
import {UserRepository} from './user.repository';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {
  public readonly subscription: HasOneRepositoryFactory<
    Subscription,
    typeof Customer.prototype.id
  >;

  public readonly users: HasManyRepositoryFactory<
    User,
    typeof User.prototype.id
  >;

  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,

    @repository.getter('UserRepository')
    protected userGetter: Getter<UserRepository>,

    @repository.getter('SubscriptionRepository')
    protected subscriptionGetter: Getter<SubscriptionRepository>,
  ) {
    super(Customer, dataSource);

    // users[]
    this.users = this.createHasManyRepositoryFactoryFor('users', userGetter);
    this.registerInclusionResolver('users', this.users.inclusionResolver);

    //subscription
    this.subscription = this.createHasOneRepositoryFactoryFor(
      'subscription',
      subscriptionGetter,
    );
    this.registerInclusionResolver(
      'subscription',
      this.subscription.inclusionResolver,
    );
  }
}
