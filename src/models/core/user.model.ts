import {
  belongsTo,
  hasMany,
  hasOne,
  model,
  property,
  referencesMany,
} from '@loopback/repository';
import {
  ExtensionSettings,
  ExtensionSettingsWithRelations,
} from '@models/browser-extension';
import {BaseEntity} from './base-entity.model';
import {UserColors} from './user-colors.model';
import {Customer, CustomerWithRelations} from './customer.model';
import {UserBookmarks} from './user-bookmarks.model';

import {
  UserCredentials,
  UserCredentialsWithRelations,
} from './user-credentials.model';
import {UserDevices, UserDevicesWithRelations} from './user-devices.model';
import {UserIdentity, UserIdentityWithRelations} from './user-identity.model';
import {UserImprovements} from './user-improvements.model';
import {UserVitals, UserVitalsWithRelations} from './user-vitals.model';
import {
  UserScreenTime,
  UserScreenTimeWithRelations,
} from '@models/browser-extension/user-screentime.model';
import {PermissionKey} from '../../components/authorization/types';

@model({
  name: 'user',
})
export class User extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
    index: {unique: true},
  })
  username: string;

  @property({
    type: 'string',
    required: true,
    index: {unique: true},
  })
  email: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  roles: PermissionKey[];

  @property({
    type: 'boolean',
  })
  emailVerified?: boolean;

  @property({
    type: 'string',
  })
  verificationToken?: string;

  @property({
    type: 'object',
  })
  info?: {
    department?: string;
    [key: string]: string | number | object | undefined;
  };

  @hasOne(() => UserCredentials)
  credentials?: UserCredentials;

  @hasMany(() => UserIdentity)
  profiles?: UserIdentity[];

  @referencesMany(() => UserDevices)
  deviceIds?: UserDevices[];

  @hasOne(() => UserVitals)
  vitals?: UserVitals;

  @hasOne(() => ExtensionSettings)
  extensionSettings?: ExtensionSettings;

  @hasOne(() => UserImprovements)
  improvements?: UserImprovements;

  @hasOne(() => UserBookmarks)
  bookmakrs?: UserBookmarks;

  @hasOne(() => UserColors)
  colors?: UserColors;

  @belongsTo(() => Customer)
  customerId?: string;

  @hasMany(() => UserScreenTime)
  screenTime?: UserScreenTime[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
  improvements?: UserImprovements;
  bookmark?: UserBookmarks;
  extensionSettings?: ExtensionSettingsWithRelations;
  credentials?: UserCredentialsWithRelations;
  vitals?: UserVitalsWithRelations;
  devices?: UserDevicesWithRelations[];
  profiles?: UserIdentityWithRelations[];
  customerId?: CustomerWithRelations;
  colors?: UserColors;
  screenTime?: UserScreenTimeWithRelations[];
}

export type UserWithRelations = User & UserRelations;
