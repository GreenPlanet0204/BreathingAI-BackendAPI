import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {User, UserWithRelations} from './user.model';

@model({
  name: 'user_credential',
})
export class UserCredentials extends BaseEntity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  password: string;

  @belongsTo(() => User)
  userId?: string;

  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}
export interface UserCredentialsRelations {
  // describe navigational properties here
  userId?: UserWithRelations;
}

export type UserCredentialsWithRelations = UserCredentials &
  UserCredentialsRelations;
