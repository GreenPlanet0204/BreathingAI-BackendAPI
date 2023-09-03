import {BindingScope, injectable} from '@loopback/core';
import Stripe from 'stripe';
import {SubscriptionPlans} from '@models/core';
import {SubscriptionRepository, CustomerRepository} from '@repositories/core';
import {repository} from '@loopback/repository/dist/decorators/repository.decorator';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? '';

@injectable({scope: BindingScope.SINGLETON})
export class PaymentService {
  stripe: Stripe;
  constructor(
    @repository(SubscriptionRepository)
    public subscriptionRepositrory: SubscriptionRepository,
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
  ) {
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2022-08-01',
    });
  }

  // <=============================================add new customer method=========================================>

  addNewCustomer = async (email: string, description?: string) => {
    const customer = await this.stripe.customers.create({
      email,
      description: description ?? 'New Customer',
    });

    // const localcustomer=await this.customerRepository.create({
    //   id:custmorId
    // })
    return customer;
  };

  // <=============================================get customer by id method=========================================>

  getCustomerByID = async (id: string) => {
    const customer = await this.stripe.customers.retrieve(id);
    return customer;
  };

  // <=============================================getproduct method=========================================>

  getProducts = async () => {
    const products = await this.stripe.products.list();
    return products;
  };

  // <=============================================create payment method=========================================>

  createPaymentMethod = async (
    customerId: string,
    paymentMethodData: Stripe.PaymentMethodCreateParams,
  ) => {
    const {type, card} = paymentMethodData;
    // Create a payment method using the provided data
    const paymentMethod = await this.stripe.paymentMethods.create({
      type,
      card,
    });
    // Attach the payment method to the customer using the customer ID
    await this.stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customerId,
    });
    // Update the invoice settings of the customer to set the payment method as default
    await this.stripe.customers.update(customerId, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      invoice_settings: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        default_payment_method: paymentMethod.id,
      },
    });

    // Return the created payment method
    return paymentMethod;
  };

  // <=============================================create subscription method=========================================>

  createSubscription = async (customerId: string, priceId: string) => {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{price: priceId}],
    });
    const createSubscription = await this.subscriptionRepositrory.create({
      customerId: customerId,
      plan: priceId,
      hasTrial: false,
    });

    return {
      stripeSubscription: subscription,
      localSubscription: createSubscription,
    };
  };

  // <=============================================update subscription method=========================================>

  // PaymentService class

  updateSubscription = async (
    customerId: string,
    subscriptionId: string,
    plan: SubscriptionPlans,
    subscriptionIdDatabase: number,
  ) => {
    // Retrieve the subscription
    const subscription = await this.stripe.subscriptions.retrieve(
      subscriptionId,
    );
    const subscriptions = await this.subscriptionRepositrory.findById(
      subscriptionIdDatabase,
    );
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Get the subscription item ID
    const subscriptionItemId = subscription.items.data[0].id;

    // Update the subscription item with the new plan in Stripe
    const updatedSubscriptionItem = await this.stripe.subscriptionItems.update(
      subscriptionItemId,
      {
        price: plan,
      },
    );

    const Localsubscription = await this.subscriptionRepositrory.update(
      subscriptions,
      {
        // customerData: stripeCustomerData,
        plan: plan,
        hasTrial: false,
      },
    );

    return {
      updatedSubscriptionItem: updatedSubscriptionItem,
      Localsubscription: Localsubscription,
    };
  };

  // <===========================================================create subscription for B2B=====================================================>

  getProductPrice = async (priceId: string): Promise<number> => {
    try {
      const price = await this.stripe.prices.retrieve(priceId);
      if (!price.unit_amount) {
        throw new Error(`Price ${priceId} does not have a valid unit_amount.`);
      }
      const unitAmount = price.unit_amount;
      const amountInCents = unitAmount / 100; // Convert from cents to dollars
      return amountInCents;
    } catch (error) {
      throw new Error(`Failed to retrieve product price: ${error.message}`);
    }
  };

  createSubscriptionB2B = async (
    customerId: string,
    priceId: string,
    quantity: number,
    totalAmount: number,
  ) => {
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{price: priceId, quantity: quantity}],
      metadata: {totalAmount: totalAmount},
    });
    const createSubscription = await this.subscriptionRepositrory.create({
      customerId: customerId,
      plan: priceId,
      quantity: quantity,
      hasTrial: false,
    });

    return {
      stripeSubscription: subscription,
      localSubscription: createSubscription,
    };
  };
}
