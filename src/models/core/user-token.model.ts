import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {User} from './user.model';

export enum TokenPurposes {
  PASSWRD_RESET = 'password_reset',
  VERIFY_EMAIL = 'verify_email',
}
@model({
  name: 'user_token',
})
export class UserToken extends BaseEntity {
  @property({
    type: 'string',
    id: true,
  })
  token: string;

  @belongsTo(() => User)
  userId: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(TokenPurposes),
      default: TokenPurposes.PASSWRD_RESET,
    },
  })
  purpose: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserTokenRelations {
  // describe navigational properties here
}

export type UserTokenWithRelations = UserToken & UserTokenRelations;
