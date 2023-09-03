import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {put, requestBody, SchemaObject, post, get, param} from '@loopback/rest';
import {
  UserRepository,
  UserIdentityRepository,
  SubscriptionRepository,
} from '@repositories/core';
import {CustomerRepository} from '@repositories/core';
import {SubscriptionPlans} from '@models/core';
import {PaymentService} from '@services/core';
import {AuthenticationMethodBindings} from '@authentication/strategies/keys';
import {authenticate} from '@loopback/authentication';
import Stripe from 'stripe';

interface UpdateSubscription {
  customerId: string;
  plan: SubscriptionPlans;
  currentPlan: SubscriptionPlans;
  desiredPlan: SubscriptionPlans;
}

const AddCustomerSchema: SchemaObject = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    description: {
      type: 'string',
    },
  },
};

const CreatePaymentMethodSchema: SchemaObject = {
  type: 'object',
  required: ['type', 'card'],
  properties: {
    type: {
      type: 'string',
    },
    card: {
      type: 'object',
      properties: {
        number: {
          type: 'string',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        exp_month: {
          type: 'integer',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        exp_year: {
          type: 'integer',
        },
        cvc: {
          type: 'string',
        },
      },
    },
  },
};

const CreateSubscriptionSchema: SchemaObject = {
  type: 'object',
  required: ['customerId', 'priceId'],
  properties: {
    customerId: {
      type: 'string',
    },
    priceId: {
      type: 'string',
    },
    quantity: {
      type: 'string',
    },
  },
};

const UpdateSubscriptionSchema: SchemaObject = {
  type: 'object',
  properties: {
    plan: {type: 'string'}, // Add any additional properties as needed
  },
  required: ['plan'], // Add any additional required properties
};

// const UpdateSubscriptionSchema: SchemaObject = {
//   type: 'object',
//   properties: {
//     customerId: { type: 'string' },
//     currentPlan: { type: 'string', enum: Object.values(SubscriptionPlans) },
//     desiredPlan: { type: 'string', enum: Object.values(SubscriptionPlans) },
//   },
//   required: ['customerId', 'currentPlan', 'desiredPlan'],
// };

export class SubscriptionController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserIdentityRepository)
    public subscriptionRepositrory: SubscriptionRepository,
    @service(PaymentService)
    public paymentService: PaymentService,
  ) {}

  // <========================================create customer===============================================>

  @authenticate(AuthenticationMethodBindings.SESSION.key)
  @post('/customers')
  async addCustomer(
    @requestBody({
      description: 'Customer data',
      required: true,
      content: {
        'application/json': {schema: AddCustomerSchema},
      },
    })
    customerData: {
      email: string;
      description?: string;
    },
  ) {
    try {
      const {email, description} = customerData;
      const customer = await this.paymentService.addNewCustomer(
        email,
        description,
      );
      return {success: true, customer};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // <========================================get customer===============================================>
  @authenticate(AuthenticationMethodBindings.SESSION.key)
  @get('/customers/{customerId}')
  async getCustomer(@param.path.string('customerId') id: string) {
    try {
      const customer = await this.paymentService.getCustomerByID(id);
      // const localCustomer = await this.customerRepository.findById(id);
      return {success: true, customer};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // <========================================get products===============================================>

  @get('/products')
  async getProducts() {
    try {
      const products = await this.paymentService.getProducts();
      return {success: true, products};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // <========================================create paymentmethods===============================================>

  @authenticate(AuthenticationMethodBindings.SESSION.key)
  @post('/customers/{customerId}/payment-methods')
  async createPaymentMethod(
    @param.path.string('customerId') customerId: string,
    @requestBody({
      description: 'Payment method data',
      required: true,
      content: {
        'application/json': {schema: CreatePaymentMethodSchema},
      },
    })
    paymentMethodData: Stripe.PaymentMethodCreateParams,
  ) {
    try {
      const paymentMethod = await this.paymentService.createPaymentMethod(
        customerId,
        paymentMethodData,
      );
      return {success: true, paymentMethod};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // <========================================create subscription===============================================>
  @authenticate(AuthenticationMethodBindings.SESSION.key)
  @post('/create-subscriptions')
  async createSubscription(
    @requestBody({
      description: 'Subscription data',
      required: true,
      content: {
        'application/json': {schema: CreateSubscriptionSchema},
      },
    })
    subscriptionData: {
      customerId: string;
      priceId: string;
    },
  ) {
    try {
      const {customerId, priceId} = subscriptionData;
      const newSubscription = await this.paymentService.createSubscription(
        customerId,
        priceId,
      );
      //  const subscription=await this.subscriptionRepositrory.c(newSubscription)
      return {success: true, newSubscription: newSubscription};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // // <========================================update subscriptions===============================================>

  // Your endpoint code
  @authenticate(AuthenticationMethodBindings.SESSION.key)
  @put(
    '/update-subscription/{customerId}/{subscriptionId}/{subscriptionIdDatabase}',
  )
  async updateSubscriptionEndpoint(
    @param.path.string('customerId') customerId: string,
    @param.path.string('subscriptionId') subscriptionId: string,
    @param.path.string('subscriptionIdDatabase') subscriptionIdDatabase: number,
    @requestBody({
      description: 'Update user subscription',
      required: true,
      content: {
        'application/json': {schema: UpdateSubscriptionSchema},
      },
    })
    updateSubscriptionData: UpdateSubscription,
  ) {
    try {
      const {plan} = updateSubscriptionData;

      // Update the subscription in Stripe using the payment service
      const updatedSubscription = await this.paymentService.updateSubscription(
        customerId,
        subscriptionId,
        plan,
        subscriptionIdDatabase,
      );

      // const subscription = await this.subscriptionRepositrory.findById(subscriptionIdDatabase);

      // subscription.plan = SubscriptionPlans.BASIC;

      // const updatedSubscriptionDatabase = await this.subscriptionRepositrory.updateSubscription(subscriptionIdDatabase);

      return {
        success: true,
        message: 'Subscription updated successfully',
        updatedSubscription: updatedSubscription,
        // updatedSubscriptionDatabase: updatedSubscriptionDatabase
      };
    } catch (error) {
      return {success: false, error: error.message};
    }
  }

  // <==============================subscription for B2B============================================================================>
  @authenticate(AuthenticationMethodBindings.SESSION.key)
  @post('/create-subscriptions-for-B2B')
  async createSubscriptionB2B(
    @requestBody({
      description: 'Subscription data',
      required: true,
      content: {
        'application/json': {schema: CreateSubscriptionSchema},
      },
    })
    subscriptionData: {
      customerId: string;
      priceId: string;
      quantity: number;
    },
  ) {
    try {
      const {customerId, priceId, quantity} = subscriptionData;
      const productPrice = await this.paymentService.getProductPrice(priceId);

      // Calculate the total amount based on the unit price and quantity
      const totalAmount = productPrice * quantity;

      const newSubscription = await this.paymentService.createSubscriptionB2B(
        customerId,
        priceId,
        quantity,
        totalAmount,
      );

      // const subscription = await this.subscriptionRepositrory.create(newSubscription);

      return {success: true, newSubscription: newSubscription};
    } catch (error) {
      return {success: false, error: error.message};
    }
  }
}
