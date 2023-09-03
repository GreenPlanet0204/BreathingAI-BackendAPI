import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {User} from './user.model';
import {VitalSigns} from './vitals-signs.model';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  DIVERSE = 'diverse',
}

@model({
  name: 'user_vitals',
})
export class UserVitals extends BaseEntity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'number',
  })
  age?: number;

  @property({
    type: 'number',
  })
  weight?: number;

  @property({
    type: 'number',
  })
  height?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(Gender),
    },
  })
  gender: string;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => VitalSigns)
  vitalSigns: VitalSigns[];

  constructor(data?: Partial<UserVitals>) {
    super(data);
  }
}

export interface UserVitalsRelations {
  // describe navigational properties here
}

export type UserVitalsWithRelations = UserVitals & UserVitalsRelations;
