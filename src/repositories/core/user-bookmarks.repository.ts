import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreSqlDataSource} from '@datasources/postgre-sql.datasource';
import {UserBookmarks, UserBookmarksRelations} from '@models/core';
import {DataSourceBindings} from '@datasources/keys';

export class UserBookmarksRepository extends DefaultCrudRepository<
  UserBookmarks,
  typeof UserBookmarks.prototype.id,
  UserBookmarksRelations
> {
  constructor(
    @inject(DataSourceBindings.DATASOURCE_PSQL)
    dataSource: PostgreSqlDataSource,
  ) {
    super(UserBookmarks, dataSource);
  }
}
