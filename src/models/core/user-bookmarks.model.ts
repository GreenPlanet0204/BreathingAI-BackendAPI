import {belongsTo, model, property, referencesMany} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {Content} from './content.model';
import {User} from './user.model';

@model({
  name: 'user_bookmarks',
})
export class UserBookmarks extends BaseEntity {
  @property({
    id: true,
    generated: true,
  })
  id: number;

  @belongsTo(() => User)
  userId: string;

  @referencesMany(() => Content)
  contentIds: string[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserBookmarksRelations {
  // describe navigational properties here
}

export type UserBookmarksWithRelations = UserBookmarks & UserBookmarksRelations;
