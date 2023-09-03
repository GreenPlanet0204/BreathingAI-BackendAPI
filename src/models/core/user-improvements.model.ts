import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {ImprovemnetEvent} from './improvement-event.model';
import {User} from './user.model';

@model({
  name: 'user_improvement',
})
export class UserImprovements extends BaseEntity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => ImprovemnetEvent)
  improvementEvents: ImprovemnetEvent[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserImprovementsRelations {
  // describe navigational properties here
}

export type UserImprovementsWithRelations = UserImprovements &
  UserImprovementsRelations;
