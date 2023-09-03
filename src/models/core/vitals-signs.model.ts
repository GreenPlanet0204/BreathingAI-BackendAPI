import {belongsTo, model, property, referencesOne} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {UserDevices} from './user-devices.model';
import {UserVitals} from './user-vitals.model';

@model({
  name: 'vital_sign',
})
export class VitalSigns extends BaseEntity {
  @property({
    type: 'number',
    generate: true,
    id: true,
  })
  id: number;

  // define data form devices
  @property({
    type: 'object',
    required: true,
  })
  data: object;

  @referencesOne(() => UserDevices)
  deviceId: string;

  @belongsTo(() => UserVitals)
  userVitalsId: string;

  constructor(data?: Partial<VitalSigns>) {
    super(data);
  }
}

export interface VitalSignsRelations {
  // describe navigational properties here
}

export type VitalsWithRelations = VitalSigns & VitalSignsRelations;
