import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {User, UserWithRelations} from './user.model';

@model({
  name: 'creator',
})
export class Creator extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @belongsTo(() => User)
  userId: string;

  @property({
    type: 'object',
    required: true,
  })
  profile: object;

  constructor(data?: Partial<Creator>) {
    super(data);
  }
}

export interface CreatorRelations {
  // describe navigational properties here
  user: UserWithRelations;
}

export type CreatorWithRelations = Creator & CreatorRelations;
