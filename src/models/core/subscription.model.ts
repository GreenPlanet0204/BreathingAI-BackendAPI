import {belongsTo, model, property} from '@loopback/repository';
import Stripe from 'stripe';
import {BaseEntity} from './base-entity.model';
import {Customer, CustomerWithRelations} from './customer.model';

export enum SubscriptionPlans {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
}

export interface CustomerData extends Stripe.Customer {}

@model({
  name: 'subscription',
})
export class Subscription extends BaseEntity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'object',
    required: false,
  })
  customerData?: CustomerData;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(SubscriptionPlans),
      default: SubscriptionPlans.FREE,
    },
  })
  plan?: string;

  @property({
    type: 'boolean',
  })
  hasTrial?: boolean;

  @property({
    type: 'date',
  })
  endDate?: string;

  @property({
    type: 'number',
  })
  quantity?: number;

  @belongsTo(() => Customer)
  customerId: string;

  constructor(data?: Partial<Subscription>) {
    super(data);
  }
}

export interface SubscriptionRelations {
  customerId: CustomerWithRelations;
}

export type SubscriptionWithRelations = Subscription & SubscriptionRelations;
