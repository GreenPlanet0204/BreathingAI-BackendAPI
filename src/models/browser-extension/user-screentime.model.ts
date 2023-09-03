import {belongsTo, model, property} from '@loopback/repository';
import {User, UserWithRelations} from '@models/core';
import {BaseEntity} from '@models/core/base-entity.model';
import {ScreenTime} from './types';

@model({
  name: 'user_screentime',
})
export class UserScreenTime extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  date: string;

  @belongsTo(() => User)
  userId: string;

  @property({
    type: 'object',
  })
  screenTime: ScreenTime;

  constructor(data?: Partial<UserScreenTime>) {
    super(data);
  }
}

export interface UserScreenTimeRelations {
  // describe navigational properties here
  user?: UserWithRelations;
}

export type UserScreenTimeWithRelations = UserScreenTime &
  UserScreenTimeRelations;
