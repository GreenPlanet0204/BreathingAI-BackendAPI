import {belongsTo, hasMany, model, property} from '@loopback/repository';
import {SubscriptionPlans} from './subscription.model';
import {ImprovementCategory, MethodCategory} from './types';

import {Creator, CreatorWithRelations} from './creator.model';
import {ContentRating} from './content-rating.model';
import {BaseEntity} from './base-entity.model';

@model({
  name: 'content',
})
export class Content extends BaseEntity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  language: string;

  @property({
    type: 'object',
    required: true,
  })
  file: object;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(MethodCategory),
    },
  })
  methodCategory: string[];

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(ImprovementCategory),
    },
  })
  improvementCategory: string[];

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(SubscriptionPlans),
    },
  })
  subscriptionTypes: string[];

  @belongsTo(() => Creator)
  creatorId: string;

  @hasMany(() => ContentRating)
  ratings: ContentRating[];

  constructor(data?: Partial<Content>) {
    super(data);
  }
}

export interface ContentRelations {
  creator?: CreatorWithRelations;
}

export type ContentWithRelations = Content & ContentRelations;
