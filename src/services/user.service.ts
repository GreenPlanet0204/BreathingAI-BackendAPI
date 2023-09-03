import {UserIdentityService} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {Profile as PassportProfile} from 'passport';
import {SubscriptionPlans, User} from '@models/core';
import {
  CustomerRepository,
  SubscriptionRepository,
  UserCredentialsRepository,
  UserRepository,
} from '@repositories/core';
import {UserIdentityRepository} from '@repositories/core';
import {createUuid, UuidNamespaces} from './uuid';
import {PermissionKey} from '../components/authorization/types';
import {service} from '@loopback/core';
import {PaymentService} from './payment.service';
import {PasswordService} from './password.service';
import {HttpErrors} from '@loopback/rest';

/**
 * User service to accept a 'passport' user profile and save it locally
 */
export class PassportUserIdentityService
  implements UserIdentityService<PassportProfile, User>
{
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserIdentityRepository)
    public userIdentityRepository: UserIdentityRepository,
    @repository(SubscriptionRepository)
    public subscriptionRepositrory: SubscriptionRepository,
    @service(PaymentService)
    public paymentService: PaymentService,
  ) {}

  /**
   * B2C
   * find a linked local user for an external profile
   * create a local user if not created yet.
   * @param email
   * @param profile
   * @param token
   */
  async findOrCreateUser(profile: PassportProfile): Promise<User> {
    if (!profile?.emails?.length) {
      throw new Error('email is required in returned profile to login');
    }

    const email = profile.emails[0].value;

    let customer;

    const customerId = createUuid(UuidNamespaces.CUSTOMER, email);

    try {
      customer = await this.customerRepository.findById(customerId);
    } catch (err) {
      if (err.code !== 'ENTITY_NOT_FOUND') {
        throw err;
      }
    }
    if (!customer) {
      // const stripeCustomer = await this.paymentService.addNewCustomer(email);

      customer = await this.customerRepository.create({
        id: createUuid(UuidNamespaces.CUSTOMER, email),
        firstName: profile.name?.givenName ?? profile.displayName,
        lastName: profile.name?.familyName ?? profile.displayName,
        b2b: false,
        // stripeCustomer: stripeCustomer,
      });
    }

    await this.subscriptionRepositrory.create({
      customerId: customer.id,
      // customerData: stripeCustomerData,
      plan: SubscriptionPlans.FREE,
      hasTrial: false,
    });

    const users: User[] = await this.userRepository.find({
      where: {
        email: email,
      },
    });
    let user: User;

    if (!users?.length) {
      user = await this.userRepository.create({
        id: createUuid(UuidNamespaces.USER, email),
        email: email,
        firstName: profile.name?.givenName ?? profile.displayName,
        lastName: profile.name?.familyName ?? profile.displayName,
        username: email,
        roles: [PermissionKey.USER],
        customerId: customerId,
      });
    } else {
      user = users[0];
    }
    user = await this.linkExternalProfile('' + user.id, profile);
    return user;
  }

  /**
   * link external profile with local user b2c
   * @param userId
   * @param userIdentity
   */
  async linkExternalProfile(
    userId: string,
    userIdentity: PassportProfile,
  ): Promise<User> {
    let profile;
    try {
      profile = await this.userIdentityRepository.findById(userIdentity.id);
    } catch (err) {
      // no need to throw an error if entity is not found
      if (!(err.code === 'ENTITY_NOT_FOUND')) {
        throw err;
      }
    }

    if (!profile) {
      await this.createUser(userId, userIdentity);
    } else {
      await this.userIdentityRepository.updateById(userIdentity.id, {
        profile: {
          emails: userIdentity.emails,
        },
      });
    }
    return this.userRepository.findById(userId, {
      include: ['profiles'],
    });
  }

  //@TODO: find or create B2B user

  /**
   * create a copy of the external profile
   * @param userId
   * @param userIdentity
   */
  async createUser(
    userId: string,
    userIdentity: PassportProfile,
  ): Promise<void> {
    await this.userIdentityRepository.create({
      id: userIdentity.id,
      provider: userIdentity.provider,
      authScheme: userIdentity.provider,
      userId: userId,
      profile: {
        emails: userIdentity.emails,
      },
    });
  }
}

export class UserService {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @repository(SubscriptionRepository)
    public subscriptionRepositrory: SubscriptionRepository,
    @service(PaymentService)
    public paymentService: PaymentService,
    @service(PasswordService)
    public passwordService: PasswordService,
  ) {}

  async createAccount(credentials: {
    email: string;
    companyName?: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    let userCredentials;
    let customer;
    let user;

    const customerId = createUuid(UuidNamespaces.CUSTOMER, credentials.email);
    const userId = createUuid(UuidNamespaces.USER, credentials.email);

    try {
      userCredentials = await this.userCredentialsRepository.findById(
        credentials.email.toLowerCase(),
      );
    } catch (err) {
      if (err.code !== 'ENTITY_NOT_FOUND') {
        throw err;
      }
    }

    try {
      user = await this.userRepository.findById(userId);
    } catch (err) {
      if (err.code !== 'ENTITY_NOT_FOUND') {
        throw err;
      }
    }

    try {
      customer = await this.customerRepository.findById(customerId);
    } catch (err) {
      if (err.code !== 'ENTITY_NOT_FOUND') {
        throw err;
      }
    }

    if (!userCredentials && !user) {
      // @TODO: reintroduce
      // const stripeCustomerData = await this.paymentService.addNewCustomer(
      //   credentials.email,
      // );

      if (!customer) {
        customer = await this.customerRepository.create({
          id: createUuid(UuidNamespaces.CUSTOMER, credentials.email),
          companyName: credentials.companyName,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
        });
      }
      await this.subscriptionRepositrory.create({
        customerId: customer.id,
        // customerData: stripeCustomerData,
        plan: SubscriptionPlans.FREE,
        hasTrial: false,
      });

      user = await this.userRepository.create({
        id: userId,
        email: credentials.email,
        username: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        customerId: customer.id,
        roles: [PermissionKey.USER],
      });

      const hashedPassword = await this.passwordService.encryptPassword(
        credentials.password,
      );

      userCredentials = await this.userCredentialsRepository.create({
        id: credentials.email,
        password: hashedPassword,
        userId: user.id,
      });
    } else {
      throw new HttpErrors.Forbidden('User already exists');
    }
    return {
      customer,
      user,
    };
  }

  async createB2BAccount(credentials: {
    email: string;
    companyName?: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    let userCredentials;
    const AccountId = createUuid(UuidNamespaces.CUSTOMER, credentials.email);

    const userId = createUuid(UuidNamespaces.USER, credentials.email);

    const existingAccount = await this.customerRepository.findOne({
      where: {
        id: AccountId,
      },
    });

    const existingUser = await this.userRepository.findOne({
      where: {
        id: userId,
        customerId: AccountId,
      },
    });

    try {
      userCredentials = await this.userCredentialsRepository.findById(
        credentials.email.toLowerCase(),
      );
    } catch (err) {
      if (err.code !== 'ENTITY_NOT_FOUND') {
        throw err;
      }
    }

    if (existingAccount) {
      // If the Account already exists, we will return a 409 Conflict error
      throw new HttpErrors.Conflict('Account already exists');
    }

    if (existingUser && userCredentials) {
      // If the Account already exists, we will return a 409 Conflict error
      throw new HttpErrors.Conflict(
        'A user with this email already exists or belongs to a registered company',
      );
    }

    const customer = await this.customerRepository.create({
      id: AccountId,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      b2b: true,
      info: {
        seats: 1,
      },
    });

    const user = await this.userRepository.create({
      id: userId,
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      customerId: customer.id,
      roles: [PermissionKey.USER, PermissionKey.AGENT],
      username: credentials.email,
    });

    const hashedPassword = await this.passwordService.encryptPassword(
      credentials.password,
    );

    await this.userCredentialsRepository.create({
      id: credentials.email,
      password: hashedPassword,
      userId: user.id,
    });

    // main user
    // const users = await this.customerRepository.users(AccountId).find({
    //   where: {
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     roles: {inq: [`"{${PermissionKey.AGENT}}"`] as any},
    //   },
    // });

    return {
      customer,
      user,
    };
  }

  async addUserToCustomer(
    credentials: {
      email: string;
      firstName: string;
      lastName: string;
      department: string;
    },
    customerId: string,
  ) {
    let userCredentials;

    let user;

    const userId = createUuid(UuidNamespaces.USER, credentials.email);

    try {
      userCredentials = await this.userCredentialsRepository.findById(
        credentials.email.toLowerCase(),
      );
    } catch (err) {
      if (err.code !== 'ENTITY_NOT_FOUND') {
        throw err;
      }
    }

    try {
      user = await this.userRepository.findById(userId);
    } catch (err) {
      if (err.code !== 'ENTITY_NOT_FOUND') {
        throw err;
      }
    }

    if (!userCredentials && !user) {
      user = await this.userRepository.create({
        id: userId,
        email: credentials.email,
        username: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        customerId,
        info: {
          department: credentials.department,
        },
        roles: [PermissionKey.USER],
      });

      const hashedPassword = await this.passwordService.encryptPassword(userId);

      userCredentials = await this.userCredentialsRepository.create({
        id: credentials.email,
        password: hashedPassword,
        userId: user.id,
      });
    } else {
      throw new HttpErrors.Forbidden('User already exists');
    }
  }
}
