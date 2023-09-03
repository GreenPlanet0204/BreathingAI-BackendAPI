import {hasMany, hasOne, model, property} from '@loopback/repository';
import {BaseEntity} from './base-entity.model';
import {Subscription, SubscriptionWithRelations} from './subscription.model';
import {User, UserWithRelations} from './user.model';
import {BillingAddress} from './types';
import Stripe from 'stripe';

@model({
  name: 'customer',
})
export class Customer extends BaseEntity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  companyName?: string;

  @property({
    type: 'string',
    // required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    // required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'number',
  })
  phoneNumber: number;

  @property({
    type: 'string',
  })
  language: string;

  @property({
    type: 'boolean',
    default: false,
  })
  b2b: boolean;

  @property({
    type: 'object',
  })
  info?: {
    seats?: number;
    website?: string;
    industry?: string;
    country?: string;
    [key: string]: string | number | Array<string | number> | undefined;
  };

  @property({
    type: 'object',
  })
  stripeCustomer?: Stripe.Customer;

  @property({
    type: 'object',
  })
  billingAddress?: BillingAddress;

  @hasOne(() => Subscription)
  subscription?: Subscription;

  @hasMany(() => User)
  users?: User[];

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
  subscription?: SubscriptionWithRelations;
  defaultUser?: UserWithRelations;
  user?: UserWithRelations;
  users?: UserWithRelations[];
}

export type CustomerWithRelations = Customer & CustomerRelations;
