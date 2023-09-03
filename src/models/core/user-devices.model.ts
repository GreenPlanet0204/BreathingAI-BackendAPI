import {belongsTo, hasOne, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {
  DeviceAuhtenticationWithRelations,
  DeviceAuthentication,
} from './device-auhtentication.model';
import {User, UserWithRelations} from './user.model';

export enum DeviceTypes {
  WEBSITE = 'website',
  BROWSER_EXTENSION = 'browser_extension',
  FIT_BIT = 'fit_bit',
  WATCH_OS = 'watch_os',
}

@model({
  name: 'user_device',
})
export class UserDevices extends BaseEntity {
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
    jsonSchema: {
      enum: Object.values(DeviceTypes),
    },
  })
  type: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @belongsTo(() => User)
  userId: string;

  @hasOne(() => DeviceAuthentication)
  auth: DeviceAuthentication;

  constructor(data?: Partial<UserDevices>) {
    super(data);
  }
}

export interface UserDevicesRelations {
  // describe navigational properties here
  userId?: UserWithRelations;
  auth?: DeviceAuhtenticationWithRelations;
}

export type UserDevicesWithRelations = UserDevices & UserDevicesRelations;
