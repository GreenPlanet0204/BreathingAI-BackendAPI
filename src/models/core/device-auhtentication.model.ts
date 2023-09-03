import {belongsTo, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {UserDevices, UserDevicesWithRelations} from './user-devices.model';

@model({
  name: 'device_authentication',
})
export class DeviceAuthentication extends BaseEntity {
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
  token: string;

  @property({
    type: 'string',
  })
  refreshToken?: string;

  @belongsTo(() => UserDevices)
  userDeviceId: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<DeviceAuthentication>) {
    super(data);
  }
}

export interface DeviceAuhtenticationRelations {
  // describe navigational properties here
  userDeviceId?: UserDevicesWithRelations;
}

export type DeviceAuhtenticationWithRelations = DeviceAuthentication &
  DeviceAuhtenticationRelations;
