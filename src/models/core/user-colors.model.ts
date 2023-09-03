import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {User} from './user.model';

@model({
  name: 'user_color',
})
export class UserColors extends BaseEntity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @belongsTo(() => User)
  userId?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  colors: string[];

  constructor(data?: Partial<UserColors>) {
    super(data);
  }
}

export interface UserColorsRelations {
  // describe navigational properties here
}

export type ColorsWithRelations = UserColors & UserColorsRelations;
