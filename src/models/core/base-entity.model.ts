import {Entity, property} from '@loopback/repository';

export class BaseEntity extends Entity {
  @property({
    type: 'date',
    default: () => new Date(),
    name: 'created_on',
  })
  createdOn?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
    name: 'modified_on',
  })
  modifiedOn?: Date;
}
