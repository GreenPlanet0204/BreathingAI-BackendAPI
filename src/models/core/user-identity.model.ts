import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {User, UserRelations} from './user.model';

@model({
  name: 'user_identity',
})
export class UserIdentity extends BaseEntity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  provider: string;

  @property({
    type: 'object',
    required: true,
  })
  profile: object;

  @property({
    type: 'object',
  })
  credentials?: object;

  @property({
    type: 'string',
    required: true,
  })
  authScheme: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<UserIdentity>) {
    super(data);
  }
}

export interface UserIdentityRelations {
  // describe navigational properties here
  userId?: UserRelations;
}

export type UserIdentityWithRelations = UserIdentity & UserIdentityRelations;
