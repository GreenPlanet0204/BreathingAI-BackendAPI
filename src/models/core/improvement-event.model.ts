import {model, property, belongsTo, referencesMany} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {Content} from './content.model';
import {DeviceTypes} from './user-devices.model';
import {UserImprovements} from './user-improvements.model';
import {User} from './user.model';

@model({
  name: 'improvement_event',
})
export class ImprovemnetEvent extends BaseEntity {
  @property({
    id: true,
    generated: true,
  })
  id: number;

  @belongsTo(() => UserImprovements)
  userImprovementId: string;

  @referencesMany(() => Content)
  contentIds?: string[];

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(DeviceTypes),
    },
  })
  device?: string;

  @property({
    type: 'boolean',
  })
  completed?: boolean;

  @property({
    type: 'number',
  })
  rating?: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface ImprovemnetEventRelations {
  // describe navigational properties here
}

export type ImprovemnetEventWithRelations = ImprovemnetEvent &
  ImprovemnetEventRelations;
