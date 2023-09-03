import {model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';

@model({
  name: 'content_rating',
})
export class ContentRating extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  contentId: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'number',
    required: true,
  })
  rating: number;

  constructor(data?: Partial<ContentRating>) {
    super(data);
  }
}

export interface ContentRatingRelations {
  // describe navigational properties here
}

export type ContentRatingWithRelations = ContentRating & ContentRatingRelations;
