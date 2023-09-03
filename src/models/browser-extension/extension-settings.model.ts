import {belongsTo, model, property} from '@loopback/repository';
import {User, UserWithRelations} from '@models/core';
import {BaseEntity} from '@models/core/base-entity.model';
import {
  AppSettings,
  BreaksSettings,
  ColorsSettings,
  SoundsSettings,
} from './types';

@model({
  name: 'extension_setting',
})
export class ExtensionSettings extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  id: string;

  @belongsTo(() => User)
  userId: string;

  @property({
    type: 'object',
  })
  app: AppSettings;

  @property({
    type: 'object',
    required: true,
  })
  breaks: BreaksSettings;

  @property({
    type: 'object',
  })
  colors: ColorsSettings;

  @property({
    type: 'object',
  })
  sounds: SoundsSettings;

  constructor(data?: Partial<ExtensionSettings>) {
    super(data);
  }
}

export interface ExtensionSettingsRelations {
  // describe navigational properties here
  user?: UserWithRelations;
}

export type ExtensionSettingsWithRelations = ExtensionSettings &
  ExtensionSettingsRelations;
